// rozlucka-michal API worker
// Routes:
//   POST   /api/submissions
//   GET    /api/feed[?limit=N]
//   POST   /api/feed/:id/read
//   DELETE /api/feed/:id
//   GET    /api/push/vapid-public
//   POST   /api/push/subscribe
//   GET    /api/photo/:id
//   GET    /api/admin/export?format=json|csv
//   POST   /api/food                      { name, choice, submissionId? }
//   GET    /api/admin/food?format=json|csv
//   DELETE /api/admin/food/:id
//   POST   /api/admin/push                { title?, body?, url? }   broadcast tickle
//   GET    /api/latest-broadcast
//   POST   /api/wedding/submissions       (X-Site-Pass header required)
//   GET    /api/admin/wedding?format=json|csv
//   DELETE /api/admin/wedding/:id

const QUESTION_KEYS = [
  "q1_name",
  "q2_relation",
  "q3_meeting",
  "q4_realised",
  "q5_growth",
  "q6_story",
  "q7_taught",
  "q8_wish_more",
  "q9_one_sentence",
];
const REQUIRED_KEYS = ["q1_name", "q2_relation", "q3_meeting"];
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const MAX_TEXT_BYTES = 8000;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/gif",
]);
const FEED_INDEX_KEY = "feed_snapshot";
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, authorization",
  "access-control-max-age": "86400",
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }
    try {
      const res = await route(request, env, ctx);
      const headers = new Headers(res.headers);
      for (const [k, v] of Object.entries(CORS)) headers.set(k, v);
      return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ error: "internal", detail: String(err) }), {
        status: 500,
        headers: { "content-type": "application/json; charset=utf-8", ...CORS },
      });
    }
  },
};

async function route(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  if (path === "/api/submissions" && method === "POST") return submissionsPost(request, env, ctx);
  if (path === "/api/feed" && method === "GET") return feedGet(request, env);
  if (path === "/api/push/vapid-public" && method === "GET") return vapidPublicGet(env);
  if (path === "/api/push/subscribe" && method === "POST") return pushSubscribePost(request, env);
  if (path === "/api/admin/export" && method === "GET") return adminExportGet(request, env);
  if (path === "/api/food" && method === "POST") return foodPost(request, env, ctx);
  if (path === "/api/admin/food" && method === "GET") return adminFoodGet(request, env);
  if (path === "/api/admin/push" && method === "POST") return adminPushPost(request, env, ctx);
  if (path === "/api/latest-broadcast" && method === "GET") return latestBroadcastGet(env);
  if (path === "/api/wedding/submissions" && method === "POST") return weddingPost(request, env);
  if (path === "/api/admin/wedding" && method === "GET") return adminWeddingGet(request, env);

  let m = path.match(/^\/api\/feed\/([A-Za-z0-9_-]+)\/read$/);
  if (m && method === "POST") return feedReadPost(m[1], env);

  m = path.match(/^\/api\/feed\/([A-Za-z0-9_-]+)$/);
  if (m && method === "DELETE") return feedDelete(m[1], env);

  m = path.match(/^\/api\/photo\/([A-Za-z0-9_-]+)$/);
  if (m && method === "GET") return photoGet(m[1], env);

  m = path.match(/^\/api\/admin\/food\/([A-Za-z0-9_-]+)$/);
  if (m && method === "DELETE") return adminFoodDelete(m[1], request, env);

  m = path.match(/^\/api\/admin\/wedding\/([A-Za-z0-9_-]+)$/);
  if (m && method === "DELETE") return adminWeddingDelete(m[1], request, env);

  return new Response(JSON.stringify({ error: "not found", path, method }), {
    status: 404,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

// ---------- handlers ----------

async function submissionsPost(request, env, ctx) {
  const ct = request.headers.get("content-type") || "";
  if (!ct.includes("multipart/form-data")) return jsonErr(400, "expected multipart/form-data");
  let form;
  try {
    form = await request.formData();
  } catch (e) {
    return jsonErr(400, `invalid form: ${e.message}`);
  }
  const language = pickLang(str(form.get("language")));
  const fields = {};
  for (const k of QUESTION_KEYS) {
    const v = str(form.get(k)).trim();
    if (v.length > MAX_TEXT_BYTES) return jsonErr(400, `${k} exceeds ${MAX_TEXT_BYTES} bytes`);
    if (v) fields[k] = v;
  }
  for (const k of REQUIRED_KEYS) if (!fields[k]) return jsonErr(400, `missing ${k}`);
  const extra = str(form.get("extra")).trim();
  if (extra.length > MAX_TEXT_BYTES) return jsonErr(400, "extra exceeds limit");
  const photo = form.get("photo");
  if (!(photo instanceof File) || photo.size === 0) return jsonErr(400, "photo missing");
  if (photo.size > MAX_PHOTO_BYTES)
    return jsonErr(413, `photo too large (max ${MAX_PHOTO_BYTES} bytes)`);
  const photoCt = (photo.type || "image/jpeg").toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.has(photoCt)) return jsonErr(415, `unsupported photo type ${photoCt}`);

  const id = newId();
  const photoBytes = await photo.arrayBuffer();
  await env.KV.put(`photo:${id}`, photoBytes, {
    metadata: { contentType: photoCt, size: photoBytes.byteLength },
  });

  const submission = {
    id,
    language,
    name: fields.q1_name,
    ...fields,
    extra: extra || undefined,
    photoUrl: `${publicBase(env)}/api/photo/${id}`,
    photoContentType: photoCt,
    submittedAt: Date.now(),
  };
  await env.KV.put(`submission:${id}`, JSON.stringify(submission));

  const idx = (await env.KV.get(FEED_INDEX_KEY, "json")) || [];
  idx.unshift({ id, submittedAt: submission.submittedAt });
  await env.KV.put(FEED_INDEX_KEY, JSON.stringify(idx));

  ctx.waitUntil(notifySubscribers(env));

  return json(200, {
    ok: true,
    id,
    submittedAt: submission.submittedAt,
    photoUrl: submission.photoUrl,
  });
}

async function feedGet(request, env) {
  const url = new URL(request.url);
  const limitParam = parseInt(url.searchParams.get("limit") || "", 10);
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 200) : 100;
  const idx = (await env.KV.get(FEED_INDEX_KEY, "json")) || [];
  const ids = idx.slice(0, limit).map((e) => e.id);
  const subs = (
    await Promise.all(ids.map((id) => env.KV.get(`submission:${id}`, "json")))
  ).filter(Boolean);
  return json(200, { submissions: subs, count: idx.length });
}

async function feedReadPost(id, env) {
  const s = await env.KV.get(`submission:${id}`, "json");
  if (!s) return jsonErr(404, "not found");
  if (!s.michaloReadAt) {
    s.michaloReadAt = Date.now();
    await env.KV.put(`submission:${id}`, JSON.stringify(s));
  }
  return json(200, { ok: true, michaloReadAt: s.michaloReadAt });
}

async function feedDelete(id, env) {
  const s = await env.KV.get(`submission:${id}`, "json");
  if (!s) return jsonErr(404, "not found");
  await env.KV.delete(`submission:${id}`);
  await env.KV.delete(`photo:${id}`);
  const idx = (await env.KV.get(FEED_INDEX_KEY, "json")) || [];
  const next = idx.filter((e) => e.id !== id);
  if (next.length !== idx.length) await env.KV.put(FEED_INDEX_KEY, JSON.stringify(next));
  return json(200, { ok: true });
}

async function latestBroadcastGet(env) {
  const b = await env.KV.get("latest_broadcast", "json");
  if (!b) return json(200, { broadcast: null });
  return json(200, { broadcast: b });
}

function vapidPublicGet(env) {
  if (!env.VAPID_PUBLIC) return jsonErr(503, "VAPID not configured");
  return json(200, { publicKey: env.VAPID_PUBLIC });
}

async function pushSubscribePost(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonErr(400, "invalid JSON");
  }
  if (
    !body ||
    typeof body.endpoint !== "string" ||
    !body.keys ||
    typeof body.keys.p256dh !== "string" ||
    typeof body.keys.auth !== "string"
  ) {
    return jsonErr(400, "invalid subscription");
  }
  const sub = {
    endpoint: body.endpoint,
    keys: { p256dh: body.keys.p256dh, auth: body.keys.auth },
    userAgent: typeof body.userAgent === "string" ? body.userAgent.slice(0, 500) : undefined,
    label: typeof body.label === "string" ? body.label.slice(0, 50) : undefined,
    subscribedAt: Date.now(),
  };
  const hash = await sha256Hex(sub.endpoint);
  await env.KV.put(`push:${hash}`, JSON.stringify(sub));
  return json(200, { ok: true, id: hash });
}

async function photoGet(id, env) {
  const r = await env.KV.getWithMetadata(`photo:${id}`, "arrayBuffer");
  if (!r.value) return new Response("not found", { status: 404 });
  const meta = r.metadata || {};
  return new Response(r.value, {
    headers: {
      "content-type": meta.contentType || "image/jpeg",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}

function requireAdmin(request, env) {
  const authz = request.headers.get("authorization") || "";
  const expected = env.ADMIN_KEY || "";
  const token = authz.startsWith("Bearer ") ? authz.slice(7) : "";
  if (!expected || !token || !constantTimeEqual(token, expected)) return jsonErr(401, "unauthorized");
  return null;
}

async function foodPost(request, env, ctx) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonErr(400, "invalid JSON");
  }
  const name = str(body?.name).trim().slice(0, 200);
  const choice = str(body?.choice).trim().slice(0, 1000);
  if (!name) return jsonErr(400, "name required");
  if (!choice) return jsonErr(400, "choice required");
  const submissionId = str(body?.submissionId).trim().slice(0, 64) || undefined;
  const id = newId();
  const entry = { id, name, choice, submissionId, submittedAt: Date.now() };
  await env.KV.put(`food:${id}`, JSON.stringify(entry));
  return json(200, { ok: true, id, submittedAt: entry.submittedAt });
}

async function adminFoodGet(request, env) {
  const unauthorized = requireAdmin(request, env);
  if (unauthorized) return unauthorized;
  const url = new URL(request.url);
  const format = (url.searchParams.get("format") || "json").toLowerCase();
  const list = await env.KV.list({ prefix: "food:" });
  const entries = (
    await Promise.all(list.keys.map((k) => env.KV.get(k.name, "json")))
  ).filter(Boolean).sort((a, b) => (a.submittedAt || 0) - (b.submittedAt || 0));
  if (format === "csv") {
    const cols = ["id", "submittedAt", "submittedAtIso", "name", "choice", "submissionId"];
    const lines = [cols.join(",")];
    for (const e of entries) {
      const row = {
        ...e,
        submittedAtIso: e.submittedAt ? new Date(e.submittedAt).toISOString() : "",
      };
      lines.push(cols.map((c) => csvCell(row[c])).join(","));
    }
    return new Response(lines.join("\n"), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="rozlucka-food-${Date.now()}.csv"`,
      },
    });
  }
  return new Response(JSON.stringify({ food: entries, count: entries.length }, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="rozlucka-food-${Date.now()}.json"`,
    },
  });
}

async function adminFoodDelete(id, request, env) {
  const unauthorized = requireAdmin(request, env);
  if (unauthorized) return unauthorized;
  await env.KV.delete(`food:${id}`);
  return json(200, { ok: true });
}

// ---------- wedding (Kozlíci) ----------

const WEDDING_KEYS_HIM = ["him_wish", "him_memory", "him_oneline"];
const WEDDING_KEYS_HER = ["her_wish", "her_memory", "her_oneline"];
const WEDDING_KEYS_BOTH = ["both_wish", "both_advice", "both_memory"];
const WEDDING_KEYS = [...WEDDING_KEYS_HIM, ...WEDDING_KEYS_HER, ...WEDDING_KEYS_BOTH];

async function weddingPost(request, env) {
  const sitePass = request.headers.get("x-site-pass") || "";
  const expected = env.WEDDING_SITE_PASS || "";
  if (!expected || !constantTimeEqual(sitePass, expected)) return jsonErr(401, "wrong site password");
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonErr(400, "invalid JSON");
  }
  const language = pickLang(str(body?.language));
  const name = str(body?.name).trim().slice(0, 200);
  if (!name) return jsonErr(400, "name required");
  const email = str(body?.email).trim().slice(0, 200);
  const fields = {};
  for (const k of WEDDING_KEYS) {
    const v = str(body?.[k]).trim();
    if (v.length > MAX_TEXT_BYTES) return jsonErr(400, `${k} exceeds limit`);
    if (v) fields[k] = v;
  }
  // At least one of him/her/both must have content
  const hasAny = WEDDING_KEYS.some((k) => fields[k]);
  if (!hasAny) return jsonErr(400, "please write at least one wish");
  const id = newId();
  const entry = {
    id,
    name,
    email: email || undefined,
    language,
    ...fields,
    submittedAt: Date.now(),
  };
  await env.KV.put(`wedding:${id}`, JSON.stringify(entry));
  return json(200, { ok: true, id, submittedAt: entry.submittedAt });
}

async function adminWeddingGet(request, env) {
  const unauthorized = requireAdmin(request, env);
  if (unauthorized) return unauthorized;
  const url = new URL(request.url);
  const format = (url.searchParams.get("format") || "json").toLowerCase();
  const list = await env.KV.list({ prefix: "wedding:" });
  const entries = (await Promise.all(list.keys.map((k) => env.KV.get(k.name, "json"))))
    .filter(Boolean)
    .sort((a, b) => (a.submittedAt || 0) - (b.submittedAt || 0));
  if (format === "csv") {
    const cols = ["id", "submittedAt", "submittedAtIso", "language", "name", "email", ...WEDDING_KEYS];
    const lines = [cols.join(",")];
    for (const e of entries) {
      const row = { ...e, submittedAtIso: e.submittedAt ? new Date(e.submittedAt).toISOString() : "" };
      lines.push(cols.map((c) => csvCell(row[c])).join(","));
    }
    return new Response(lines.join("\n"), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="kozlici-wishes-${Date.now()}.csv"`,
      },
    });
  }
  return new Response(JSON.stringify({ submissions: entries, count: entries.length }, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="kozlici-wishes-${Date.now()}.json"`,
    },
  });
}

async function adminWeddingDelete(id, request, env) {
  const unauthorized = requireAdmin(request, env);
  if (unauthorized) return unauthorized;
  await env.KV.delete(`wedding:${id}`);
  return json(200, { ok: true });
}

async function adminPushPost(request, env, ctx) {
  const unauthorized = requireAdmin(request, env);
  if (unauthorized) return unauthorized;
  if (!env.VAPID_PRIVATE || !env.VAPID_PUBLIC) return jsonErr(503, "VAPID not configured");
  let body = {};
  try {
    body = (await request.json()) || {};
  } catch {
    /* allow empty body — sends an empty tickle */
  }
  const broadcast = {
    title: str(body.title).slice(0, 200) || "Pro Michala",
    body: str(body.body).slice(0, 500) || "Otevři appku ❤",
    url: str(body.url).slice(0, 500) || "/",
    ts: Date.now(),
  };
  await env.KV.put("latest_broadcast", JSON.stringify(broadcast), { expirationTtl: 7 * 24 * 3600 });
  const list = await env.KV.list({ prefix: "push:" });
  let attempted = 0;
  let ok = 0;
  let dropped = 0;
  await Promise.all(
    list.keys.map(async (k) => {
      const sub = await env.KV.get(k.name, "json");
      if (!sub) return;
      attempted++;
      try {
        const r = await sendEmptyPush(sub, env.VAPID_PUBLIC, env.VAPID_PRIVATE, env.VAPID_SUBJECT);
        if (r.status === 404 || r.status === 410) {
          await env.KV.delete(k.name);
          dropped++;
        } else if (r.status >= 200 && r.status < 300) {
          ok++;
        }
      } catch {
        /* ignore individual */
      }
    }),
  );
  return json(200, { ok: true, attempted, delivered: ok, droppedExpired: dropped, broadcast });
}

async function adminExportGet(request, env) {
  const unauthorized = requireAdmin(request, env);
  if (unauthorized) return unauthorized;
  const url = new URL(request.url);
  const format = (url.searchParams.get("format") || "json").toLowerCase();
  const idx = (await env.KV.get(FEED_INDEX_KEY, "json")) || [];
  const subs = (
    await Promise.all(idx.map((e) => env.KV.get(`submission:${e.id}`, "json")))
  ).filter(Boolean);
  if (format === "csv") {
    const cols = [
      "id",
      "submittedAt",
      "language",
      "name",
      "q1_name",
      "q2_relation",
      "q3_meeting",
      "q4_realised",
      "q5_growth",
      "q6_story",
      "q7_taught",
      "q8_wish_more",
      "q9_one_sentence",
      "extra",
      "photoUrl",
      "michaloReadAt",
    ];
    const lines = [cols.join(",")];
    for (const s of subs) lines.push(cols.map((c) => csvCell(s[c])).join(","));
    return new Response(lines.join("\n"), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="rozlucka-export.csv"`,
      },
    });
  }
  return new Response(JSON.stringify({ submissions: subs, count: subs.length }, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="rozlucka-export.json"`,
    },
  });
}

// ---------- helpers ----------

async function notifySubscribers(env) {
  if (!env.VAPID_PRIVATE || !env.VAPID_PUBLIC) return;
  const list = await env.KV.list({ prefix: "push:" });
  await Promise.all(
    list.keys.map(async (k) => {
      const sub = await env.KV.get(k.name, "json");
      if (!sub) return;
      try {
        const r = await sendEmptyPush(sub, env.VAPID_PUBLIC, env.VAPID_PRIVATE, env.VAPID_SUBJECT);
        if (r.status === 404 || r.status === 410) await env.KV.delete(k.name);
      } catch {
        /* ignore individual failures */
      }
    }),
  );
}

async function sendEmptyPush(sub, publicB64u, privateB64u, subject) {
  const u = new URL(sub.endpoint);
  const origin = `${u.protocol}//${u.host}`;
  const authz = await buildVapidAuthHeader(origin, subject || "mailto:admin@example.com", publicB64u, privateB64u);
  const res = await fetch(sub.endpoint, {
    method: "POST",
    headers: {
      Authorization: authz,
      TTL: "86400",
      Urgency: "normal",
      "Content-Length": "0",
    },
  });
  return { ok: res.ok, status: res.status, statusText: res.statusText };
}

async function buildVapidAuthHeader(audience, subject, publicB64u, privateB64u) {
  const header = b64uEncode(new TextEncoder().encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const payload = b64uEncode(
    new TextEncoder().encode(
      JSON.stringify({
        aud: audience,
        exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
        sub: subject,
      }),
    ),
  );
  const signingInput = `${header}.${payload}`;
  const key = await importVapidPrivateKey(privateB64u, publicB64u);
  const sig = new Uint8Array(
    await crypto.subtle.sign(
      { name: "ECDSA", hash: "SHA-256" },
      key,
      new TextEncoder().encode(signingInput),
    ),
  );
  return `vapid t=${signingInput}.${b64uEncode(sig)}, k=${publicB64u}`;
}

async function importVapidPrivateKey(privB64u, pubB64u) {
  const d = b64uDecode(privB64u);
  const pub = b64uDecode(pubB64u);
  if (pub.length !== 65 || pub[0] !== 0x04) throw new Error("invalid VAPID public key");
  const x = pub.subarray(1, 33);
  const y = pub.subarray(33, 65);
  const jwk = {
    kty: "EC",
    crv: "P-256",
    d: b64uEncode(d),
    x: b64uEncode(x),
    y: b64uEncode(y),
    ext: true,
  };
  return crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
}

function b64uEncode(bytes) {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (const b of arr) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64uDecode(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function sha256Hex(s) {
  const data = new TextEncoder().encode(s);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function newId() {
  const buf = new Uint8Array(12);
  crypto.getRandomValues(buf);
  const ALPH = "0123456789abcdefghjkmnpqrstvwxyz";
  let bits = 0;
  let val = 0;
  let out = "";
  for (const b of buf) {
    val = (val << 8) | b;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      out += ALPH[(val >> bits) & 31];
    }
  }
  if (bits > 0) out += ALPH[(val << (5 - bits)) & 31];
  return out;
}

function publicBase(env) {
  return (env.PUBLIC_URL || "").replace(/\/$/, "");
}

function pickLang(v) {
  return v === "cs" || v === "en" ? v : "cs";
}

function str(v) {
  return typeof v === "string" ? v : "";
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function jsonErr(status, msg) {
  return json(status, { error: msg });
}

function csvCell(v) {
  if (v === undefined || v === null) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

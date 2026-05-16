// Minimal VAPID JWT signer + empty-payload web-push sender, using WebCrypto.
// We never send a payload — the service worker fetches the latest item itself,
// so we only need to authenticate the push request (VAPID auth).

function b64uEncode(bytes: Uint8Array | ArrayBuffer): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (const b of arr) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64uDecode(s: string): Uint8Array {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function importVapidPrivateKey(privB64u: string, pubB64u: string): Promise<CryptoKey> {
  const d = b64uDecode(privB64u);
  const pub = b64uDecode(pubB64u);
  // pub is 0x04 || X(32) || Y(32) — 65 bytes
  if (pub.length !== 65 || pub[0] !== 0x04) throw new Error("invalid VAPID public key format");
  const x = pub.subarray(1, 33);
  const y = pub.subarray(33, 65);
  const jwk: JsonWebKey = {
    kty: "EC",
    crv: "P-256",
    d: b64uEncode(d),
    x: b64uEncode(x),
    y: b64uEncode(y),
    ext: true,
  };
  return crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
}

export async function buildVapidAuthHeader(
  endpointOrigin: string,
  subject: string,
  publicB64u: string,
  privateB64u: string,
): Promise<string> {
  const header = b64uEncode(new TextEncoder().encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const payload = b64uEncode(
    new TextEncoder().encode(
      JSON.stringify({
        aud: endpointOrigin,
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
  // WebCrypto returns r||s (64 bytes for P-256), already the JWS format.
  const jwt = `${signingInput}.${b64uEncode(sig)}`;
  return `vapid t=${jwt}, k=${publicB64u}`;
}

export async function sendEmptyPush(
  sub: { endpoint: string },
  publicB64u: string,
  privateB64u: string,
  subject: string,
): Promise<{ ok: boolean; status: number; statusText: string }> {
  const u = new URL(sub.endpoint);
  const origin = `${u.protocol}//${u.host}`;
  const authz = await buildVapidAuthHeader(origin, subject, publicB64u, privateB64u);
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

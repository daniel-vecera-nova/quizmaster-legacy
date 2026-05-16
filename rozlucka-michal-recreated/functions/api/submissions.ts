import {
  Env,
  Submission,
  getFeedIndex,
  newId,
  putFeedIndex,
  putPhoto,
  putSubmission,
  listPushSubs,
  deletePushSubByEndpoint,
} from "../_lib/storage";
import { sendEmptyPush } from "../_lib/vapid";

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
] as const;

const REQUIRED_KEYS: Array<(typeof QUESTION_KEYS)[number]> = [
  "q1_name",
  "q2_relation",
  "q3_meeting",
];

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

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  const ct = request.headers.get("content-type") || "";
  if (!ct.includes("multipart/form-data")) {
    return json({ error: "expected multipart/form-data" }, 400);
  }
  let form: FormData;
  try {
    form = await request.formData();
  } catch (e) {
    return json({ error: `invalid form: ${(e as Error).message}` }, 400);
  }

  const language = pickLang(str(form.get("language")));

  const fields: Record<string, string> = {};
  for (const k of QUESTION_KEYS) {
    const v = str(form.get(k)).trim();
    if (v.length > MAX_TEXT_BYTES) {
      return json({ error: `${k} exceeds ${MAX_TEXT_BYTES} bytes` }, 400);
    }
    if (v) fields[k] = v;
  }
  for (const k of REQUIRED_KEYS) {
    if (!fields[k]) return json({ error: `missing ${k}` }, 400);
  }
  const extra = str(form.get("extra")).trim();
  if (extra.length > MAX_TEXT_BYTES) {
    return json({ error: "extra exceeds limit" }, 400);
  }

  const photo = form.get("photo");
  if (!(photo instanceof File) || photo.size === 0) {
    return json({ error: "photo missing" }, 400);
  }
  if (photo.size > MAX_PHOTO_BYTES) {
    return json({ error: `photo too large (max ${MAX_PHOTO_BYTES} bytes)` }, 413);
  }
  const photoCt = (photo.type || "image/jpeg").toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.has(photoCt)) {
    return json({ error: `unsupported photo type ${photoCt}` }, 415);
  }

  const id = newId();
  const photoBytes = await photo.arrayBuffer();
  await putPhoto(env, id, photoBytes, photoCt);

  const submission: Submission = {
    id,
    language,
    name: fields.q1_name,
    q1_name: fields.q1_name,
    q2_relation: fields.q2_relation,
    q3_meeting: fields.q3_meeting,
    q4_realised: fields.q4_realised,
    q5_growth: fields.q5_growth,
    q6_story: fields.q6_story,
    q7_taught: fields.q7_taught,
    q8_wish_more: fields.q8_wish_more,
    q9_one_sentence: fields.q9_one_sentence,
    extra: extra || undefined,
    photoUrl: `/api/photo/${id}`,
    photoContentType: photoCt,
    submittedAt: Date.now(),
  };
  await putSubmission(env, submission);

  const idx = await getFeedIndex(env);
  idx.unshift({ id, submittedAt: submission.submittedAt });
  await putFeedIndex(env, idx);

  // Fan out empty push to all subscribers; SW will fetch the latest item.
  ctx.waitUntil(notifySubscribers(env));

  return json({ ok: true, id, submittedAt: submission.submittedAt, photoUrl: submission.photoUrl });
};

async function notifySubscribers(env: Env): Promise<void> {
  if (!env.VAPID_PRIVATE || !env.VAPID_PUBLIC) return;
  const subs = await listPushSubs(env);
  await Promise.all(
    subs.map(async (s) => {
      try {
        const r = await sendEmptyPush(s, env.VAPID_PUBLIC, env.VAPID_PRIVATE, env.VAPID_SUBJECT);
        if (r.status === 404 || r.status === 410) {
          await deletePushSubByEndpoint(env, s.endpoint);
        }
      } catch {
        // ignore individual delivery failures
      }
    }),
  );
}

function pickLang(v: string): string {
  return v === "cs" || v === "en" ? v : "cs";
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v : "";
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

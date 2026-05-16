export interface Env {
  KV: KVNamespace;
  ADMIN_KEY: string;
  VAPID_PUBLIC: string;
  VAPID_PRIVATE: string;
  VAPID_SUBJECT: string;
  PUBLIC_URL: string;
}

export interface Submission {
  id: string;
  language: string;
  name: string;
  q1_name: string;
  q2_relation: string;
  q3_meeting: string;
  q4_realised?: string;
  q5_growth?: string;
  q6_story?: string;
  q7_taught?: string;
  q8_wish_more?: string;
  q9_one_sentence?: string;
  extra?: string;
  photoUrl: string;
  photoContentType: string;
  submittedAt: number;
  michaloReadAt?: number;
}

export interface FeedIndexEntry {
  id: string;
  submittedAt: number;
}

export interface PushSub {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  userAgent?: string;
  label?: string;
  subscribedAt: number;
}

const FEED_INDEX_KEY = "feed_snapshot";

export async function getFeedIndex(env: Env): Promise<FeedIndexEntry[]> {
  const raw = await env.KV.get(FEED_INDEX_KEY, "json");
  if (!raw || !Array.isArray(raw)) return [];
  return raw as FeedIndexEntry[];
}

export async function putFeedIndex(env: Env, idx: FeedIndexEntry[]): Promise<void> {
  await env.KV.put(FEED_INDEX_KEY, JSON.stringify(idx));
}

export async function getSubmission(env: Env, id: string): Promise<Submission | null> {
  return (await env.KV.get(`submission:${id}`, "json")) as Submission | null;
}

export async function putSubmission(env: Env, s: Submission): Promise<void> {
  await env.KV.put(`submission:${s.id}`, JSON.stringify(s));
}

export async function deleteSubmission(env: Env, id: string): Promise<void> {
  await env.KV.delete(`submission:${id}`);
  await env.KV.delete(`photo:${id}`);
  const idx = await getFeedIndex(env);
  const next = idx.filter((e) => e.id !== id);
  if (next.length !== idx.length) await putFeedIndex(env, next);
}

export async function putPhoto(
  env: Env,
  id: string,
  bytes: ArrayBuffer,
  contentType: string,
): Promise<void> {
  await env.KV.put(`photo:${id}`, bytes, {
    metadata: { contentType, size: bytes.byteLength },
  });
}

export async function getPhoto(
  env: Env,
  id: string,
): Promise<{ bytes: ArrayBuffer; contentType: string } | null> {
  const result = await env.KV.getWithMetadata(`photo:${id}`, "arrayBuffer");
  if (!result.value) return null;
  const meta = (result.metadata ?? {}) as { contentType?: string };
  return { bytes: result.value, contentType: meta.contentType || "image/jpeg" };
}

export async function listPushSubs(env: Env): Promise<PushSub[]> {
  const list = await env.KV.list({ prefix: "push:" });
  const subs: PushSub[] = [];
  for (const k of list.keys) {
    const v = (await env.KV.get(k.name, "json")) as PushSub | null;
    if (v) subs.push(v);
  }
  return subs;
}

export async function putPushSub(env: Env, sub: PushSub): Promise<string> {
  const hash = await sha256Hex(sub.endpoint);
  await env.KV.put(`push:${hash}`, JSON.stringify(sub));
  return hash;
}

export async function deletePushSubByEndpoint(env: Env, endpoint: string): Promise<void> {
  const hash = await sha256Hex(endpoint);
  await env.KV.delete(`push:${hash}`);
}

export async function sha256Hex(s: string): Promise<string> {
  const data = new TextEncoder().encode(s);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function newId(): string {
  // 12 bytes → 16 chars base32 (no padding), URL-safe
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

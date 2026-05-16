import { Env } from "../../_lib/storage";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const publicKey = ctx.env.VAPID_PUBLIC;
  if (!publicKey) {
    return new Response(JSON.stringify({ error: "VAPID not configured" }), {
      status: 503,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }
  return new Response(JSON.stringify({ publicKey }), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};

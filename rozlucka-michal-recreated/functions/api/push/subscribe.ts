import { Env, PushSub, putPushSub } from "../../_lib/storage";

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  let body: any;
  try {
    body = await ctx.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid JSON" }), {
      status: 400,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }
  if (
    !body ||
    typeof body.endpoint !== "string" ||
    !body.keys ||
    typeof body.keys.p256dh !== "string" ||
    typeof body.keys.auth !== "string"
  ) {
    return new Response(JSON.stringify({ error: "invalid subscription" }), {
      status: 400,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }
  const sub: PushSub = {
    endpoint: body.endpoint,
    keys: { p256dh: body.keys.p256dh, auth: body.keys.auth },
    userAgent: typeof body.userAgent === "string" ? body.userAgent.slice(0, 500) : undefined,
    label: typeof body.label === "string" ? body.label.slice(0, 50) : undefined,
    subscribedAt: Date.now(),
  };
  const hash = await putPushSub(ctx.env, sub);
  return new Response(JSON.stringify({ ok: true, id: hash }), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};

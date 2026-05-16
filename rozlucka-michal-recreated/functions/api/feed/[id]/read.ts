import { Env, getSubmission, putSubmission } from "../../../_lib/storage";

export const onRequestPost: PagesFunction<Env, "id"> = async (ctx) => {
  const id = ctx.params.id as string;
  const s = await getSubmission(ctx.env, id);
  if (!s) return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
  if (!s.michaloReadAt) {
    s.michaloReadAt = Date.now();
    await putSubmission(ctx.env, s);
  }
  return new Response(JSON.stringify({ ok: true, michaloReadAt: s.michaloReadAt }), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};

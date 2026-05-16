import { Env, deleteSubmission, getSubmission } from "../../../_lib/storage";

export const onRequestDelete: PagesFunction<Env, "id"> = async (ctx) => {
  const id = ctx.params.id as string;
  const s = await getSubmission(ctx.env, id);
  if (!s) return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
  await deleteSubmission(ctx.env, id);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};

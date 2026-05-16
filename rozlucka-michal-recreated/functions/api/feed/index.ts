import { Env, getFeedIndex, getSubmission } from "../../_lib/storage";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url);
  const limitParam = parseInt(url.searchParams.get("limit") || "", 10);
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 200) : 100;

  const idx = await getFeedIndex(ctx.env);
  const ids = idx.slice(0, limit).map((e) => e.id);
  const submissions = (await Promise.all(ids.map((id) => getSubmission(ctx.env, id)))).filter(
    Boolean,
  );

  return new Response(JSON.stringify({ submissions, count: idx.length }), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};

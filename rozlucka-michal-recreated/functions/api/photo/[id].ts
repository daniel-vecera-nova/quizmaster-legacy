import { Env, getPhoto } from "../../_lib/storage";

export const onRequestGet: PagesFunction<Env, "id"> = async (ctx) => {
  const id = ctx.params.id as string;
  const photo = await getPhoto(ctx.env, id);
  if (!photo) return new Response("not found", { status: 404 });
  return new Response(photo.bytes, {
    headers: {
      "content-type": photo.contentType,
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
};

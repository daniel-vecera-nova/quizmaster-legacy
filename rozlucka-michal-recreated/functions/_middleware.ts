const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, authorization",
  "access-control-max-age": "86400",
};

export const onRequest: PagesFunction = async (ctx) => {
  if (ctx.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }
  const res = await ctx.next();
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(CORS)) headers.set(k, v);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
};

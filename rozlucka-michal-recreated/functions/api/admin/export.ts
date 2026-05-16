import { Env, getFeedIndex, getSubmission } from "../../_lib/storage";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const authz = ctx.request.headers.get("authorization") || "";
  const expected = ctx.env.ADMIN_KEY || "";
  const token = authz.startsWith("Bearer ") ? authz.slice(7) : "";
  if (!expected || !token || !constantTimeEqual(token, expected)) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }

  const url = new URL(ctx.request.url);
  const format = (url.searchParams.get("format") || "json").toLowerCase();

  const idx = await getFeedIndex(ctx.env);
  const submissions = (
    await Promise.all(idx.map((e) => getSubmission(ctx.env, e.id)))
  ).filter(Boolean);

  if (format === "csv") {
    const cols = [
      "id",
      "submittedAt",
      "language",
      "name",
      "q1_name",
      "q2_relation",
      "q3_meeting",
      "q4_realised",
      "q5_growth",
      "q6_story",
      "q7_taught",
      "q8_wish_more",
      "q9_one_sentence",
      "extra",
      "photoUrl",
      "michaloReadAt",
    ];
    const lines = [cols.join(",")];
    for (const s of submissions as any[]) {
      lines.push(cols.map((c) => csvCell((s as any)[c])).join(","));
    }
    return new Response(lines.join("\n"), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="rozlucka-export.csv"`,
      },
    });
  }

  return new Response(JSON.stringify({ submissions, count: submissions.length }, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="rozlucka-export.json"`,
    },
  });
};

function csvCell(v: unknown): string {
  if (v === undefined || v === null) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

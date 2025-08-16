// app/api/health/route.ts
export const runtime = 'nodejs';

export async function GET() {
  const hasKey = Boolean(process.env.RAPID_API_KEY);
  return Response.json({ ok: true, hasKey });
}

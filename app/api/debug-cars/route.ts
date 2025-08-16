// app/api/debug-cars/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;

  const manufacturer = sp.get('manufacturer')?.trim() ?? '';
  const model = sp.get('model')?.trim() ?? '';
  const fuel = sp.get('fuel')?.trim() ?? '';
  const year = sp.get('year')?.trim() ?? '';
  // const limit = sp.get('limit')?.trim() ?? '10'; // ⛔️ NE PAS UTILISER

  const qs = new URLSearchParams();
  if (manufacturer) qs.set('make', manufacturer);
  if (model) qs.set('model', model);
  if (fuel) qs.set('fuel_type', fuel);
  if (year) qs.set('year', year);
  // ⛔️ NE PAS METTRE qs.set('limit', ...)

  const outUrl = `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?${qs.toString()}`;

  const res = await fetch(outUrl, {
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY || '',
      'X-RapidAPI-Host': 'cars-by-api-ninjas.p.rapidapi.com',
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  const text = await res.text();
  let parsed: any = null;
  try {
    parsed = JSON.parse(text);
  } catch {}
  const count = Array.isArray(parsed) ? parsed.length : null;

  return Response.json(
    {
      ok: res.ok,
      status: res.status,
      requestUrl: outUrl,
      paramsSent: Object.fromEntries(qs),
      count,
      sample: Array.isArray(parsed) ? parsed.slice(0, 3) : text.slice(0, 300),
    },
    { status: res.ok ? 200 : res.status },
  );
}

// app/api/debug-cars/route.ts
export const runtime = 'nodejs';         // pour avoir les logs côté Runtime
export const dynamic = 'force-dynamic';  // évite tout cache

export async function GET(req: Request) {
  const urlIn = new URL(req.url);
  const sp = urlIn.searchParams;

  const manufacturer = sp.get('manufacturer')?.trim() ?? '';
  const model = sp.get('model')?.trim() ?? '';
  const fuel = sp.get('fuel')?.trim() ?? '';
  const year = sp.get('year')?.trim() ?? '';
  const limit = sp.get('limit')?.trim() ?? '10';

  const qs = new URLSearchParams();
  if (manufacturer) qs.set('make', manufacturer);
  if (model) qs.set('model', model);
  if (fuel) qs.set('fuel_type', fuel);
  if (year) qs.set('year', year);           // n’ajoute l’année que si fournie
  qs.set('limit', limit);

  const outUrl = `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?${qs.toString()}`;
  const key = process.env.RAPID_API_KEY;

  if (!key) {
    return Response.json({ ok: false, reason: 'Missing RAPID_API_KEY' }, { status: 500 });
  }

  try {
    const res = await fetch(outUrl, {
      headers: {
        'X-RapidAPI-Key': key,
        'X-RapidAPI-Host': 'cars-by-api-ninjas.p.rapidapi.com',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    const text = await res.text(); // on lit en texte pour debug brut
    let parsed: any = null;
    try { parsed = JSON.parse(text); } catch {}

    const count = Array.isArray(parsed) ? parsed.length : null;

    return Response.json({
      ok: res.ok,
      status: res.status,
      requestUrl: outUrl,
      paramsSent: Object.fromEntries(qs),
      count,
      sample: Array.isArray(parsed) ? parsed.slice(0, 3) : text.slice(0, 300)
    }, { status: res.ok ? 200 : res.status });
  } catch (e: any) {
    return Response.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}

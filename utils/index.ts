import { CarProps, FilterProps } from '@/types';

export async function fetchCars(filters: FilterProps) {
  const manufacturer = (filters.manufacturer ?? '').trim();
  const model = (filters.model ?? '').trim();
  const fuel = (filters.fuel ?? '').trim();
  const limitNum = Number(filters.limit ?? 10);
  const year = filters.year !== undefined || filters.year !== '' ? String(filters.year) : '';

  const key = process.env.RAPID_API_KEY;
  if (!key) return [];

  const qs = new URLSearchParams();
  if (manufacturer) qs.set('make', manufacturer);
  if (model) qs.set('model', model);
  if (fuel) qs.set('fuel_type', fuel);
  if (year) qs.set('year', year);

  // ⛔️ NE PAS ENVOYER `limit` → premium only
  const url = `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?${qs.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': key,
        'X-RapidAPI-Host': 'cars-by-api-ninjas.p.rapidapi.com',
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      // Optionnel: log du corps pour debug fin
      // console.error('Cars API error:', response.status, await response.text());
      return [];
    }

    const data = await response.json();
    // Coupe côté serveur pour l’UI
    return Array.isArray(data) ? data.slice(0, Math.max(1, limitNum)) : [];
  } catch {
    return [];
  }
}

export const calculateCarRent = (city_mpg: number, year: number) => {
  const basePricePerDay = 50; // Base rental price per day in dollars
  const mileageFactor = 0.1; // Additional rate per mile driven
  const ageFactor = 0.05; // Additional rate per year of vehicle age

  // Calculate additional rate based on mileage and age
  const mileageRate = city_mpg * mileageFactor;
  const ageRate = (new Date().getFullYear() - year) * ageFactor;

  // Calculate total rental rate per day
  const rentalRatePerDay = basePricePerDay + mileageRate + ageRate;

  return rentalRatePerDay.toFixed(0);
};

export const generateCarImageUrl = (car: CarProps, angle?: string) => {
  const url = new URL('https://cdn.imagin.studio/getimage');
  const { make, model, year } = car;

  url.searchParams.append('customer', 'hrjavascript-mastery');
  url.searchParams.append('make', make);
  url.searchParams.append('modelFamily', model.split(' ')[0]);
  url.searchParams.append('zoomType', 'fullscreen');
  url.searchParams.append('modelYear', `${year}`);
  // url.searchParams.append('zoomLevel', zoomLevel);
  url.searchParams.append('angle', `${angle}`);

  return `${url}`;
};

export const updateSearchParams = (type: string, value: string) => {
  const searchParams = new URLSearchParams(window.location.search); // Get the current URL search params
  searchParams.set(type, value); // Set the specified search parameter to the given value

  const newPathname = `${window.location.pathname}?${searchParams.toString()}`; // Set the specified search parameter to the given value

  return newPathname;
};

import { CarCard, CustomFilter, Hero, SearchBar, ShowMore } from '@/components';
import { fuels, yearsOfProduction } from '@/constants'; // ← assure-toi de cet import
import { HomeProps } from '@/types';
import { fetchCars, fetchDefaultCars } from '@/utils';

export default async function Home({ searchParams }: HomeProps) {
  const manufacturer = (searchParams.manufacturer as string) || '';
  const model = (searchParams.model as string) || '';
  const fuel = (searchParams.fuel as string) || '';
  const year = searchParams.year as string | number | undefined;
  const limit = Number(searchParams.limit ?? 10);

  const hasFilters = Boolean(
    manufacturer.trim() || model.trim() || fuel.trim() || (year !== undefined && String(year).trim()),
  );

  const allCars = hasFilters ? await fetchCars(
    { manufacturer, model, fuel, year, limit }) : await fetchDefaultCars(10); // ← nombre de cartes par défaut

  const isDataEmpty = !Array.isArray(allCars) || allCars.length === 0;

  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="padding-x padding-y max-width mt-12" id="discover">
               <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore the cars you might like</p>
        </div>

        <div className="home__filters">
          <SearchBar />

          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} />
            <CustomFilter title="year" options={yearsOfProduction} />
          </div>
        </div>
        {!isDataEmpty ? (
          <section>
            <div className="home__cars-wrapper">
              {allCars.map((car: any, idx: number) => (
                <CarCard key={`${car?.make}-${car?.model}-${car?.year}-${idx}`} car={car} />
              ))}
            </div>
            {/* <ShowMore pageNumber={pageNumber} isNext={isNext} /> */}
          </section>
        ) : (
          <div className="home__error-container">
            <h2 className="text-xl font-bold text-black">Oops, no results</h2>
            <p className="text-gray-500">Try another manufacturer, model, or year.</p>
          </div>
        )}
      </div>
    </main>
  );
}

import { CarCard, CustomFilter, Hero, SearchBar, ShowMore } from '@/components';
import { fuels, yearsOfProduction } from '@/constants';
import { HomeProps } from '@/types';
import { fetchCars } from '@/utils';

export default async function Home({ searchParams }: HomeProps) {
  const limit = Number(searchParams.limit ?? 10);

  const allCars = await fetchCars({
    manufacturer: searchParams.manufacturer || '',
    year: searchParams.year,
    fuel: searchParams.fuel || '',
    model: searchParams.model || '',
    limit, // utilisé uniquement pour slice côté serveur
  });

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;
  const pageNumber = 1;
  const isNext = false;

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

        {/* {!isDataEmpty ? (
          <section>
            <div className="home__cars-wrapper">{allCars?.map((car) => <CarCard car={car} />)}</div>
            <ShowMore pageNumber={pageNumber} isNext={isNext} />
          </section>
        ) : (
          <div className="home__error-container">
            <h2 className="text-xl font-bold text-black">Oops, no results</h2>
            <p>No cars match your search. Try another model or manufacturer.</p>
          </div>
        )} */}
      </div>
    </main>
  );
}

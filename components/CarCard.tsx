'use client';

import { useState } from 'react';
import Image from 'next/image';
import CustomButton from './CustomButton';
import CarDetails from './CarDetails';
import { calculateCarRent, generateCarImageUrl } from '@/utils';
import { CarProps } from '@/types';

// ---- Helpers locaux pour assainir les données ----
function toNum(v: unknown, fallback: number | null = null): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function safeTxt(v: unknown, fallback = 'N/A'): string {
  if (v == null) return fallback;
  const s = String(v).trim();
  if (!s || s.toLowerCase().includes('premium subscribers only')) return fallback;
  return s;
}

interface CarCardProps {
  car: CarProps;
}

const CarCard = ({ car }: CarCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Assainir les champs potentiellement string/inconnus
  const make = safeTxt(car.make);
  const model = safeTxt(car.model);
  const year = toNum(car.year);
  const transRaw = safeTxt(car.transmission, 'N/A'); // 'a' | 'm' souvent
  const transmission =
    transRaw === 'a' ? 'Automatic' : transRaw === 'm' ? 'Manual' : transRaw;

  const drive = safeTxt(car.drive).toUpperCase(); // fwd/rwd/awd -> FWD/RWD/AWD si dispo
  const cityMpgNum = toNum(car.city_mpg);
  const cityMpgLabel = cityMpgNum != null ? `${cityMpgNum} MPG` : 'N/A';

  // Prix/jour : on évite NaN en donnant des fallbacks
  const rent = calculateCarRent(cityMpgNum ?? 25, year ?? 2015); // valeurs raisonnables si inconnues

  return (
    <div className="car-card group">
      <div className="car-card__content">
        <h2 className="car-card__content-title">
          {make} {model}
        </h2>
      </div>

      <p className="mt-6 flex text-[32px] font-extrabold">
        <span className="self-start text-[14px] font-semibold">€</span>
        {rent}
        <span className="self-end text-[14px] font-medium">/day</span>
      </p>

      <div className="relative my-3 h-40 w-full object-contain">
        <Image
          src={generateCarImageUrl(car)}
          alt={`${make} ${model}`}
          className="object-contain"
          fill
          priority
        />
      </div>

      <div className="relative mt-2 flex w-full">
        <div className="text-gray flex w-full justify-between group-hover:invisible">
          <div className="flex flex-col items-center justify-center gap-2">
            <Image src="/steering-wheel.svg" alt="Steering wheel" width={20} height={20} />
            <p className="text-[14px]">{transmission}</p>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <Image src="/tire.svg" alt="Tire" width={20} height={20} />
            <p className="text-[14px]">{drive || 'N/A'}</p>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <Image src="/gas.svg" alt="Gas" width={20} height={20} />
            <p className="text-[14px]">{cityMpgLabel}</p>
          </div>
        </div>

        <div className="car-card__btn-container">
          <CustomButton
            title="View More"
            containerStyles="w-full py-[16px] rounded-full bg-primary-blue"
            textStyles="text-white text-[14px] leading-[17px] font-bold"
            rightIcon="/right-arrow.svg"
            handleClick={() => setIsOpen(true)}
          />
        </div>
      </div>

      <CarDetails isOpen={isOpen} closeModal={() => setIsOpen(false)} car={car} />
    </div>
  );
};

export default CarCard;
'use client';

import { CarProps } from '@/types';
import { calculateCarRent, generateCarImageUrl } from '@/utils';
import { safeText, toNumOrNull } from '@/utils/format';
import Image from 'next/image';
import { useState } from 'react';
import CarDetails from './CarDetails';
import CustomButton from './CustomButton';

interface CarCardProps {
  car: CarProps;
}

const CarCard = ({ car }: CarCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Nettoyage des valeurs
  const make = safeText(car.make);
  const model = safeText(car.model);
  const trans = safeText(car.transmission);
  const drive = safeText(car.drive).toUpperCase();
  const cityMpgNum = toNumOrNull(car.city_mpg);
  const yearNum = toNumOrNull(car.year) ?? 2020; // fallback pour l'image & le calcul

  // Empêche NaN
  const carRent = calculateCarRent(cityMpgNum ?? 25, yearNum);

  return (
    <div className="car-card group">
      <div className="car-card__content">
        <h2 className="car-card__content-title">
          {make} {model}
        </h2>
      </div>

      <p className="mt-6 flex text-[32px] font-extrabold">
        <span className="self-start text-[14px] font-semibold">€</span>
        {Number.isFinite(carRent) ? carRent : '—'}
        <span className="self-end text-[14px] font-medium">/day</span>
      </p>

      <div className="relative my-3 h-40 w-full object-contain">
        <Image src={generateCarImageUrl(car)} alt={`${make} ${model}`} className="object-contain" fill priority />
      </div>

      <div className="relative mt-2 flex w-full">
        <div className="text-gray flex w-full justify-between group-hover:invisible">
          <div className="flex flex-col items-center justify-center gap-2">
            <Image src="/steering-wheel.svg" alt="Steering wheel" width={20} height={20} />
            <p className="text-[14px]">{trans === 'a' ? 'Automatic' : trans === 'm' ? 'Manual' : trans}</p>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <Image src="/tire.svg" alt="Tire" width={20} height={20} />
            <p className="text-[14px]">{drive}</p>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <Image src="/gas.svg" alt="Gas" width={20} height={20} />
            <p className="text-[14px]">{cityMpgNum != null ? `${cityMpgNum} MPG` : 'N/A MPG'}</p>
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

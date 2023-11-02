'use client';

import { useState } from 'react';
import { CarProps } from '@/types';
import { calculateCarRent } from '@/utils';
import Image from 'next/image';
import CustomButton from './CustomButton';
import CarDetails from './CarDetails';

interface CarCardProps {
  car: CarProps;
}

const CarCard = ({ car }: CarCardProps) => {
  const { city_mpg, year, make, model, transmission, drive } = car;
  const [isOpen, setIsOpen] = useState(false);

  const carRent = calculateCarRent(city_mpg, year);

  return (
    <div className="car-card group">
      <div className="car-card__content">
        <h2 className="car-card__content-title">
          {make} {model}
        </h2>
      </div>

      <p className="mt-6 flex text-[32px] font-extrabold">
        <span className="self-start text-[14px] font-semibold">€</span>
        {carRent}
        <span className="self-end text-[14px] font-medium">/day</span>
      </p>

      <div className="relative my-3 h-40 w-full object-contain">
        <Image src="/hero.png" alt="Car model" className="object-contain" fill priority />
      </div>

      <div className="relative mt-2 flex w-full">
        <div className="text-gray flex w-full justify-between group-hover:invisible">
          <div className="flex flex-col items-center justify-center gap-2">
            <Image src="/steering-wheel.svg" alt="Steering wheel" width={20} height={20} />
            <p className="text-[14px]">{transmission === 'a' ? 'Automatic' : 'Manual'}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <Image src="/tire.svg" alt="Tire" width={20} height={20} />
            <p className="text-[14px]">{drive.toUpperCase()}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <Image src="/gas.svg" alt="Gas" width={20} height={20} />
            <p className="text-[14px]">{city_mpg} MPG</p>
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

      <CarDetails />
    </div>
  );
};

export default CarCard;

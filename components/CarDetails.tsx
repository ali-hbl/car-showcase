'use client';

import { CarProps } from '@/types';
import { generateCarImageUrl } from '@/utils';
import { safeText, toNumOrNull } from '@/utils/format';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { Fragment } from 'react';

interface CarDetailsProps {
  isOpen: boolean;
  closeModal: () => void;
  car: CarProps;
}

const CarDetails = ({ isOpen, closeModal, car }: CarDetailsProps) => {
  // valeurs nettoyées pour l’entête + images
  const make = safeText(car.make);
  const model = safeText(car.model);
  const yearNum = toNumOrNull(car.year) ?? 2020;

  // ordre + labels jolis
  const FIELDS: Array<{ key: keyof CarProps; label: string }> = [
    { key: 'city_mpg', label: 'City Mpg' },
    { key: 'class', label: 'Class' },
    { key: 'combination_mpg', label: 'Combination Mpg' },
    { key: 'cylinders', label: 'Cylinders' },
    { key: 'displacement', label: 'Displacement' },
    { key: 'drive', label: 'Drive' },
    { key: 'fuel_type', label: 'Fuel Type' },
    { key: 'highway_mpg', label: 'Highway Mpg' },
    { key: 'make', label: 'Make' },
    { key: 'model', label: 'Model' },
    { key: 'transmission', label: 'Transmission' },
    { key: 'year', label: 'Year' },
  ];

  const renderVal = (k: keyof CarProps, v: any) => {
    // mappings simples
    if (k === 'transmission') {
      const t = safeText(v).toLowerCase();
      return t === 'a' ? 'Automatic' : t === 'm' ? 'Manual' : safeText(v);
    }
    if (k === 'drive') return safeText(v).toUpperCase();
    if (k === 'city_mpg' || k === 'highway_mpg' || k === 'combination_mpg') {
      const n = toNumOrNull(v);
      return n != null ? `${n} MPG` : 'N/A';
    }
    if (k === 'year') {
      const n = toNumOrNull(v);
      return n != null ? n : 'N/A';
    }
    return safeText(v);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-out duration-300"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative flex max-h-[90vh] w-full max-w-lg transform flex-col gap-5 overflow-y-auto rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                <button
                  type="button"
                  className="absolute right-2 top-2 z-10 w-fit rounded-full bg-primary-blue-100 p-2"
                  onClick={closeModal}
                >
                  <Image src="/close.svg" alt="close" width={20} height={20} className="object-contain" />
                </button>

                <div className="flex flex-1 flex-col gap-3">
                  <div className="relative h-40 w-full rounded-lg bg-pattern bg-cover bg-center">
                    <Image src={generateCarImageUrl(car)} alt="car model" fill priority className="object-contain" />
                  </div>

                  <div className="flex gap-3">
                    <div className="relative h-24 w-full flex-1 rounded-lg bg-primary-blue-100">
                      <Image
                        src={generateCarImageUrl(car, '29')}
                        alt="car model"
                        fill
                        priority
                        className="object-contain"
                      />
                    </div>
                    <div className="relative h-24 w-full flex-1 rounded-lg bg-primary-blue-100">
                      <Image
                        src={generateCarImageUrl(car, '33')}
                        alt="car model"
                        fill
                        priority
                        className="object-contain"
                      />
                    </div>
                    <div className="relative h-24 w-full flex-1 rounded-lg bg-primary-blue-100">
                      <Image
                        src={generateCarImageUrl(car, '13')}
                        alt="car model"
                        fill
                        priority
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <h2 className="text-xl font-semibold capitalize">
                    {make} {model}
                  </h2>

                  <div className="mt-3 grid grid-cols-2 gap-y-3">
                    {FIELDS.map(({ key, label }) => (
                      <Fragment key={String(key)}>
                        <div className="text-grey">{label}</div>
                        <div className="text-right font-semibold text-black-100">
                          {renderVal(key, (car as any)[key])}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CarDetails;

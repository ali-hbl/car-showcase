import { MouseEventHandler } from 'react';

export interface CustomButtonProps {
  title: string;
  btnType?: 'button' | 'submit';
  containerStyles?: string;
  textStyles?: string;
  rightIcon?: string;
  isDisabled?: boolean;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface SearchManuFacturerProps {
  manufacturer: string;
  setManufacturer: (manufacturer: string) => void;
}

export type CarProps = {
  make?: any;
  model?: any;
  city_mpg?: number | string;
  class?: string;
  combination_mpg?: number | string;
  cylinders?: number | string;
  displacement?: number | string;
  drive?: string;
  fuel_type?: string;
  highway_mpg?: number | string;
  transmission?: string; // 'a' | 'm' | texte
  year?: number | string;
};

// export type Car = {
//   make?: string;
//   model?: string;
//   year?: number | string;
//   class?: string;
//   fuel_type?: string;
//   transmission?: string;
//   drive?: string;
//   cylinders?: number | string;
//   displacement?: number | string;
//   city_mpg?: number | string;
//   highway_mpg?: number | string;
//   combination_mpg?: number | string;
//   // + autres champs éventuels, tous optionnels
// };

export interface FilterProps {
  manufacturer?: string;
  year?: number;
  model?: string;
  limit?: number;
  fuel?: string;
}

export interface HomeProps {
  searchParams: FilterProps;
}

export interface OptionProps {
  title: string;
  value: string;
}

export interface CustomFilterProps {
  title: string;
  options: OptionProps[];
}

export interface ShowMoreProps {
  pageNumber: number;
  isNext: boolean;
}

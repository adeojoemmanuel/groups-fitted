import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Gender } from '../../utils/enums/gender.enum';

export class AutoSizeDto {
  // @IsOptional() // required for men. Validate in Service method
  @IsNumber()
  waist_circum_preferred: number;

  // @IsString()
  // @IsOptional()
  // bra_size: string; // required for women. Validate in Service method

  @IsNumber()
  height: number;

  @IsNumber()
  weight: number;

  gender: string;

  @IsIn(['cm', 'in'])
  measurementUnit: string;

  @IsNumber()
  @IsOptional()
  @Min(13)
  @Max(89)
  age: number;

  // @IsOptional()
  shoe_size_us: number;

  // @IsOptional()
  sleeve: number;

  /* ***** Optionals ***** */
  // @IsOptional()
  chest_circum: number;

  // @IsOptional()
  fm_shoulder: number;

  // @IsOptional()
  hip_circum: number;

  // @IsOptional()
  jean_inseam: number;

  // @IsOptional()
  neck_circum_base: number;

  // @IsOptional()
  overarm: number;

  // @IsOptional()
  sleeve_inseam: number;

  // @IsIn(['ARS', 'SO'])
  // @IsOptional()
  sleeve_type: string; // extra validation based on sleeve type

  // @IsOptional()
  thigh_circum_proximal: number;

  // @IsOptional()
  waist_circum_stomach: number;

  // @IsOptional()
  waist_height_preferred: number;

  // @IsOptional()
  thigh: number;

  // @IsOptional()
  input_dress_shirt_brand: string;

  // @IsOptional()
  input_dress_shirt_fit: string;

  // @IsOptional()
  input_dress_shirt_size: string;

  // @IsOptional()
  locale: string;

  // @IsOptional()
  jacket_size: string;
}

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
import { AutoSizeDto } from './create-autosize-measurement.dto';

export class FemaleCMAutoSizeDto extends AutoSizeDto {
  @IsOptional() // required for men. Validate in Service method
  @IsNumber()
  @Min(55.8, {
    message: 'Waist must be between 55.8cm and 158cm',
  })
  @Max(158, {
    message: 'Waist must be between 55.8cm and 158cm',
  })
  waist_circum_preferred: number;

  @IsNotEmpty({
    message: 'Please enter a valid US bra size eg 30B',
  })
  bra_size: string; // required for women. Validate in Service method

  @IsNumber()
  @Min(130, {
    message: 'Height must be between 130cm and 210cm',
  })
  @Max(210, {
    message: 'Height must be between 130cm and 210cm',
  })
  height: number;

  @IsNumber()
  @Min(32, {
    message: 'Weight must be between 32kg and 191kg',
  })
  @Max(191, {
    message: 'Weight must be between 32kg and 191kg',
  })
  weight: number;

  @IsIn(['w'])
  gender: string;

  @IsNumber()
  @IsOptional()
  @Min(13)
  @Max(89)
  age: number;

  @IsOptional()
  shoe_size_us: number;

  @IsOptional()
  sleeve: number;

  /* ***** Optionals ***** */
  @IsOptional()
  @Min(72, {
    message: 'Chest Circumference must be between 72cm and 162cm',
  })
  @Max(162, {
    message: 'Chest Circumference must be between 72cm and 162cm',
  })
  chest_circum: number;

  @IsOptional()
  @Min(22.6, {
    message: 'Shoulder width must be between 22.6cm and 64.4cm',
  })
  @Max(64.4, {
    message: 'Shoulder width must be between 22.6cm and 64.4cm',
  })
  fm_shoulder: number;

  @IsOptional()
  @Min(78.8, {
    message: 'Hip Circumference must be between 78.8cm and 180cm',
  })
  @Max(180, {
    message: 'Hip Circumference must be between 78.8cm and 180cm',
  })
  hip_circum: number;

  @IsOptional()
  @Min(49.5, {
    message: 'Trouser Inseam must be between 49.5cm and 96.8cm',
  })
  @Max(96.8, {
    message: 'Trouser Inseam must be between 49.5cm and 96.8cm',
  })
  jean_inseam: number;

  @IsOptional()
  @Min(28.5, {
    message: 'Neck must be between 28.5cm and 125.7cm',
  })
  @Max(125.7, {
    message: 'Neck must be between 28.5cm and 125.7cm',
  })
  neck_circum_base: number;

  @IsOptional()
  @Min(90.5, {
    message: 'Overarm must be between 90.5cm and 193.3cm',
  })
  @Max(193.3, {
    message: 'Overarm must be between 90.5cm and 193.3cm',
  })
  overarm: number;

  @IsOptional()
  @Min(30.3, {
    message: 'Sleeve Inseam must be between 30.3cm and 58.6cm',
  })
  @Max(58.6, {
    message: 'Sleeve Inseam must be between 30.3cm and 58.6cm',
  })
  sleeve_inseam: number;

  @IsIn(['ARS', 'SO'])
  @IsOptional()
  sleeve_type: string; // extra validation based on sleeve type

  @IsOptional()
  @Min(41.3, {
    message: 'Thigh must be between 41.3cm and 105.6cm',
  })
  @Max(105.6, {
    message: 'Thigh must be between 41.3cm and 105.6cm',
  })
  thigh_circum_proximal: number;

  @IsOptional()
  @Min(61, {
    message: 'waist_circum_stomach must be between 61cm and 162.7cm',
  })
  @Max(162.7, {
    message: 'waist_circum_stomach must be between 61cm and 162.7cm',
  })
  waist_circum_stomach: number;

  @IsOptional()
  @Min(63.7, {
    message: 'Trouser Length must be between 63.7cm and 125.7cm',
  })
  @Max(125.7, {
    message: 'Trouser Length must be between 63.7cm and 125.7cm',
  })
  waist_height_preferred: number;

  @IsOptional()
  thigh: number;

  @IsOptional()
  input_dress_shirt_brand: string;

  @IsOptional()
  input_dress_shirt_fit: string;

  @IsOptional()
  input_dress_shirt_size: string;

  @IsOptional()
  locale: string;

  @IsOptional()
  jacket_size: string;

  constructor(autoSizeDto: Partial<FemaleCMAutoSizeDto>) {
    super();
    Object.assign(this, autoSizeDto);
  }
}

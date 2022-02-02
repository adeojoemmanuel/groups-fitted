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

export class MaleCMAutoSizeDto extends AutoSizeDto {
  // @IsOptional() // required for men. Validate in Service method
  @IsNumber()
  @Min(61.9, {
    message: 'Waist must be between 61.9cm and 170.2cm',
  })
  @Max(170.2, {
    message: 'Waist must be between 61.9cm and 170.2cm',
  })
  waist_circum_preferred: number;

  @IsNumber()
  @Min(131, {
    message: 'Height must be between 131cm and 218cm',
  })
  @Max(218, {
    message: 'Height must be between 131cm and 218cm',
  })
  height: number;

  @IsNumber()
  @Min(43.77, {
    message: 'Weight must be between 43.77kg and 208.7kg',
  })
  @Max(208.77, {
    message: 'Weight must be between 43.77kg and 208.7kg',
  })
  weight: number;

  @IsIn(['m'])
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
  @Min(74.4, {
    message: 'Chest Circumference must be between 74.4cm and 160cm',
  })
  @Max(160, {
    message: 'Chest Circumference must be between 74.4cm and 160cm',
  })
  chest_circum: number;

  @IsOptional()
  @Min(32.2, {
    message: 'Shoulder width must be between 32.2cm and 54.6cm',
  })
  @Max(54.6, {
    message: 'Shoulder width must be between 32.2cm and 54.6cm',
  })
  fm_shoulder: number;

  @IsOptional()
  @Min(79.5, {
    message: 'Hip Circumference must be between 79.5cm and 183.3cm',
  })
  @Max(183.3, {
    message: 'Hip Circumference must be between 79.5cm and 183.3cm',
  })
  hip_circum: number;

  @IsOptional()
  @Min(38.9, {
    message: 'Trouser Inseam must be between 38.9cm and 106.6cm',
  })
  @Max(106.6, {
    message: 'Trouser Inseam must be between 38.9cm and 106.6cm',
  })
  jean_inseam: number;

  @IsOptional()
  @Min(34.7, {
    message: 'Neck must be between 34.7cm and 62.1cm',
  })
  @Max(62.1, {
    message: 'Neck must be between 34.7cm and 62.1cm',
  })
  neck_circum_base: number;

  @IsOptional()
  @Min(97.6, {
    message: 'Overarm must be between 97.6cm and 175.4cm',
  })
  @Max(175.4, {
    message: 'Overarm must be between 97.6cm and 175.4cm',
  })
  overarm: number;

  @IsOptional()
  @Min(33, {
    message: 'Sleeve Inseam must be between 33cm and 59.8cm',
  })
  @Max(59.8, {
    message: 'Sleeve Inseam must be between 33cm and 59.8cm',
  })
  sleeve_inseam: number;

  @IsIn(['ARS', 'SO'])
  @IsOptional()
  sleeve_type: string; // extra validation based on sleeve type

  @IsOptional()
  @Min(43, {
    message: 'Thigh must be between 43cm and 101.8cm',
  })
  @Max(101.8, {
    message: 'Thigh must be between 43cm and 101.8cm',
  })
  thigh_circum_proximal: number;

  @IsOptional()
  @Min(65.4, {
    message: 'waist_circum_stomach must be between 65.4cm and 160.5cm',
  })
  @Max(160.5, {
    message: 'waist_circum_stomach must be between 65.4cm and 160.5cm',
  })
  waist_circum_stomach: number;

  @IsOptional()
  @Min(67.9, {
    message: 'Trouser Length must be between 67.9cm and 138.1cm',
  })
  @Max(138.1, {
    message: 'Trouser Length must be between 67.9cm and 138.1cm',
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

  constructor(autoSizeDto: Partial<MaleCMAutoSizeDto>) {
    super();
    Object.assign(this, autoSizeDto);
  }
}

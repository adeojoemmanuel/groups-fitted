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

export class FemaleAutoSizeDto extends AutoSizeDto {
  @IsOptional() // required for men. Validate in Service method
  @IsNumber()
  @Min(21.93, {
    message: 'Waist must be between 21.93in and 62.17in',
  })
  @Max(62.17, {
    message: 'Waist must be between 21.93in and 62.17in',
  })
  waist_circum_preferred: number;

  @IsNotEmpty({
    message: 'Please enter a valid US bra size eg 30B',
  })
  bra_size: string; // required for women. Validate in Service method

  // @IsNumber()
  // @Min(48.5, {
  //   message: "Height must be between 48.5in and 82.0in"
  // })
  // @Max(82.0, {
  //   message: "Height must be between 48.5in and 82.0in"
  // })
  // height: number;

  // @IsNumber()
  // @Min(70.51, {
  //   message: "Weight must be between 70.5pounds and 422pounds"
  // })
  // @Max(422.94, {
  //   message: "Weight must be between 70.5pounds and 422pounds"
  // })
  // weight: number;

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
  @Min(27.99, {
    message: 'Chest Circumference must be between 27.99in and 63.81in',
  })
  @Max(63.81, {
    message: 'Chest Circumference must be between 27.99in and 63.81in',
  })
  chest_circum: number;

  @IsOptional()
  @Min(8.88, {
    message: 'Shoulder width must be between 8.88in and 25.36in',
  })
  @Max(25.36, {
    message: 'Shoulder width must be between 8.88in and 25.36in',
  })
  fm_shoulder: number;

  @IsOptional()
  @Min(30.99, {
    message: 'Hip Circumference must be between 30.99in and 70.88in',
  })
  @Max(70.88, {
    message: 'Hip Circumference must be between 30.99in and 70.88in',
  })
  hip_circum: number;

  @IsOptional()
  @Min(19.45, {
    message: 'Trouser Inseam must be between 19.45in and 38.14in',
  })
  @Max(38.14, {
    message: 'Trouser Inseam must be between 19.45in and 38.14in',
  })
  jean_inseam: number;

  @IsOptional()
  @Min(11.21, {
    message: 'Neck must be between 11.21in and 49.49in',
  })
  @Max(49.49, {
    message: 'Neck must be between 11.21in and 49.49in',
  })
  neck_circum_base: number;

  @IsOptional()
  @Min(35.61, {
    message: 'Overarm must be between 35.61in and 76.12in',
  })
  @Max(76.12, {
    message: 'Overarm must be between 35.61in and 76.12in',
  })
  overarm: number;

  @IsOptional()
  @Min(11.93, {
    message: 'Sleeve Inseam must be between 11.93in and 23.1in',
  })
  @Max(23.1, {
    message: 'Sleeve Inseam must be between 11.93in and 23.1in',
  })
  sleeve_inseam: number;

  @IsIn(['ARS', 'SO'])
  @IsOptional()
  sleeve_type: string; // extra validation based on sleeve type

  @IsOptional()
  @Min(16.27, {
    message: 'Thigh must be between 16.27in and 41.6in',
  })
  @Max(41.6, {
    message: 'Thigh must be between 16.27in and 41.6in',
  })
  thigh_circum_proximal: number;

  @IsOptional()
  @Min(24.02, {
    message: 'waist_circum_stomach must be between 24.02in and 64.06in',
  })
  @Max(64.06, {
    message: 'waist_circum_stomach must be between 24.02in and 64.06in',
  })
  waist_circum_stomach: number;

  @IsOptional()
  @Min(25.08, {
    message: 'Trouser Length must be between 25.08in and 49.49in',
  })
  @Max(49.49, {
    message: 'Trouser Length must be between 25.08in and 49.49in',
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

  constructor(autoSizeDto: Partial<FemaleAutoSizeDto>) {
    super();
    Object.assign(this, autoSizeDto);
  }
}

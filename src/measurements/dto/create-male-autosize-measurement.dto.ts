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

export class MaleAutoSizeDto extends AutoSizeDto {
  // @IsOptional() // required for men. Validate in Service method
  @IsNumber()
  @Min(24.38, {
    message: 'Waist must be between 24.38in and 67.01in',
  })
  @Max(67.01, {
    message: 'Waist must be between 24.38in and 67.01in',
  })
  waist_circum_preferred: number;

  // @IsNumber()
  // @Min(51.78, {
  //   message: "Height must be between 51.78in and 85.93in"
  // })
  // @Max(85.93, {
  //   message: "Height must be between 51.78in and 85.93in"
  // })
  // height: number;

  // @IsNumber()
  // @Min(96.5, {
  //   message: "Weight must be between 96.5pounds and 460.25pounds"
  // })
  // @Max(460.25, {
  //   message: "Weight must be between 96.5pounds and 460.25pounds"
  // })
  // weight: number;

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
  @Min(29.3, {
    message: 'Chest Circumference must be between 29.3in and 63.01in',
  })
  @Max(63.01, {
    message: 'Chest Circumference must be between 29.3in and 63.01in',
  })
  chest_circum: number;

  @IsOptional()
  @Min(12.69, {
    message: 'Shoulder width must be between 12.69in and 21.52in',
  })
  @Max(21.52, {
    message: 'Shoulder width must be between 12.69in and 21.52in',
  })
  fm_shoulder: number;

  @IsOptional()
  @Min(31.33, {
    message: 'Hip Circumference must be between 31.33in and 72.2in',
  })
  @Max(72.2, {
    message: 'Hip Circumference must be between 31.33in and 72.2in',
  })
  hip_circum: number;

  @IsOptional()
  @Min(15.35, {
    message: 'Trouser Inseam must be between 15.35in and 42.0in',
  })
  @Max(42.0, {
    message: 'Trouser Inseam must be between 15.35in and 42.0in',
  })
  jean_inseam: number;

  @IsOptional()
  @Min(13.67, {
    message: 'Neck must be between 13.67in and 24.48in',
  })
  @Max(24.48, {
    message: 'Neck must be between 13.67in and 24.48in',
  })
  neck_circum_base: number;

  @IsOptional()
  @Min(38.45, {
    message: 'Overarm must be between 38.45in and 69.08in',
  })
  @Max(69.08, {
    message: 'Overarm must be between 38.45in and 69.08in',
  })
  overarm: number;

  @IsOptional()
  @Min(13.02, {
    message: 'Sleeve Inseam must be between 13.02in and 23.55in',
  })
  @Max(23.55, {
    message: 'Sleeve Inseam must be between 13.02in and 23.55in',
  })
  sleeve_inseam: number;

  @IsIn(['ARS', 'SO'])
  @IsOptional()
  sleeve_type: string; // extra validation based on sleeve type

  @IsOptional()
  @Min(16.93, {
    message: 'Thigh must be between 16.93in and 40.08in',
  })
  @Max(40.08, {
    message: 'Thigh must be between 16.93in and 40.08in',
  })
  thigh_circum_proximal: number;

  @IsOptional()
  @Min(25.75, {
    message: 'waist_circum_stomach must be between 25.75in and 63.19in',
  })
  @Max(63.19, {
    message: 'waist_circum_stomach must be between 25.75in and 63.19in',
  })
  waist_circum_stomach: number;

  @IsOptional()
  @Min(26.77, {
    message: 'Trouser Length must be between 26.77in and 54.4in',
  })
  @Max(54.4, {
    message: 'Trouser Length must be between 26.77in and 54.4in',
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

  constructor(autoSizeDto: Partial<MaleAutoSizeDto>) {
    super();
    Object.assign(this, autoSizeDto);
  }
}

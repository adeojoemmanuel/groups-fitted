import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from '../../utils/enums/gender.enum';

export class EmbroidererSignupDto {
  @MinLength(1)
  firstName: string;

  @MinLength(1)
  lastName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @MinLength(6)
  @MaxLength(6)
  otp: string;

  @MinLength(8)
  password: string;

  @MinLength(8)
  confirmPassword: string;

  @IsString()
  location: string;

  @IsEnum(Gender)
  gender: string;
  constructor(fabricSeller: Partial<EmbroidererSignupDto>) {
    Object.assign(this, fabricSeller);
  }
}

import { IsEnum } from 'class-validator';
import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  Length,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Gender } from '../../utils/enums/gender.enum';

export class TailorSignupDto {
  @MinLength(1)
  firstName: string;

  @MinLength(1)
  lastName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @MinLength(4)
  @MaxLength(4)
  otp: string;

  @IsEnum(Gender)
  gender: string;

  // @MinLength(8)
  password: string;

  // @MinLength(8)
  confirmPassword: string;

  @IsEnum(Gender)
  customerCategory: string;

  @IsString()
  location: string;

  constructor(tailor: Partial<TailorSignupDto>) {
    Object.assign(this, tailor);
  }
}

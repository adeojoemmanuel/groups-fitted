import {
  IsEmail,
  IsEnum,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from '../../utils/enums/gender.enum';

export class FabricSellerSignupDto {
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

  @IsEnum(Gender)
  gender: string;

  @MinLength(8)
  password: string;

  @MinLength(8)
  confirmPassword: string;

  @IsEnum(Gender)
  customerCategory: string;

  @IsString()
  location: string;

  constructor(fabricSeller: Partial<FabricSellerSignupDto>) {
    Object.assign(this, fabricSeller);
  }
}

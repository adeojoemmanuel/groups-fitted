import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from '../../utils/enums/gender.enum';

export class TailorSignupPasswordDto {
  @Length(1)
  firstName: string;

  @Length(1)
  lastName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phoneNumber: string;

  password: string;

  confirmPassword: string;

  @IsEnum(Gender)
  gender: string;

  @IsEnum(Gender)
  customerCategory: string;

  location: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  constructor(outfitBuyer: Partial<TailorSignupPasswordDto>) {
    Object.assign(this, outfitBuyer);
  }
}

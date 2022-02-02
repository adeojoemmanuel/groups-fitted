import {
  IsEmail,
  IsEnum,
  IsPhoneNumber,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from '../../utils/enums/gender.enum';

export class OutfitBuyerSignupDto {
  @Length(1)
  firstName: string;

  @Length(1)
  lastName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @Length(8)
  password: string;

  @Length(8)
  confirmPassword: string;

  @IsEnum(Gender)
  gender: string;

  location: string;

  constructor(outfitBuyer: Partial<OutfitBuyerSignupDto>) {
    Object.assign(this, outfitBuyer);
  }
}

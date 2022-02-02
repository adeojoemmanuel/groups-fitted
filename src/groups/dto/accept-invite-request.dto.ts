import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { Gender } from '../../utils/enums/gender.enum';

export class AcceptInviteRequestDto {
  @IsString()
  @Length(8, 8)
  code: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsEnum(Gender)
  gender: string;

  @MinLength(8)
  password: string;

  @MinLength(8)
  confirmPassword: string;

  @IsOptional()
  @MinLength(1)
  location: string;
}

import { IsNumberString, IsPhoneNumber, Length } from 'class-validator';

export class PasswordlessLoginDto {
  @IsPhoneNumber()
  phoneNumber: string;

  @IsNumberString()
  @Length(4, 4)
  otp: string;
}

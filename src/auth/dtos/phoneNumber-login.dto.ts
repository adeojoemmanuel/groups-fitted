import { IsPhoneNumber, MinLength } from 'class-validator';

export class PhoneNumberLoginDto {
  @IsPhoneNumber()
  phoneNumber: string;

  password: string;
}

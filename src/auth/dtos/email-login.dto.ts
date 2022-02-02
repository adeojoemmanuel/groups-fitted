import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class EmailLoginDto {
  @IsEmail()
  email: string;

  password: string;
}

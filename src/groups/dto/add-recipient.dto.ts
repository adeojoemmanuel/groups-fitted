import {
  IsBoolean,
  IsBooleanString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class AddRecipientDto {
  @MinLength(1)
  groupId: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsPhoneNumber()
  phoneNumber?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsBoolean()
  smsInvite: boolean;

  @IsBoolean()
  emailInvite: boolean;

  @IsBoolean()
  useInitiatorTailor: boolean;

  @IsBoolean()
  canChooseTailor: boolean;

  @IsBoolean()
  useInitiatorMeasurementToken: boolean;

  constructor(addRecipientDto: Partial<AddRecipientDto>) {
    Object.assign(this, addRecipientDto);
  }
}

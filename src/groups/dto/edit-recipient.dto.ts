import {
  IsBoolean,
  IsBooleanString,
  IsEmail,
  IsPhoneNumber,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class EditRecipientDto {
  @IsString()
  @Length(8, 8)
  code: string;

  @MinLength(1)
  groupId: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsEmail()
  email: string;

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

  constructor(editRecipientDto: Partial<EditRecipientDto>) {
    Object.assign(this, editRecipientDto);
  }
}

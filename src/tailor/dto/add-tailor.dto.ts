import {
  IsBoolean,
  IsBooleanString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Gender } from 'src/utils/enums/gender.enum';

export class AddTailorDto {
  /**
   * Tailor's firstname
   * @example 'Okunade'
   */

  @IsNotEmpty()
  @IsString()
  firstName: string;

  /**
   * Tailor's lastname
   * @example 'Stephen'
   */
  @IsNotEmpty()
  @IsString()
  lastName: string;

  /**
   * Tailor's Phone Number
   * @example '+2348102022543'
   */
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  /**
   * Tailor's Email
   * @example 'stephen@fitted.ng'
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * Tailor's Gender
   * @example 'male/female'
   */

  @IsEnum(Gender)
  gender: string;

  /**
   * Tailor's Location
   * @example 'Abuja Nigeria'
   */
  @IsString()
  location: string;

  /**
   * Enable SMS Invite
   * @example 'true/false'
   */
  @IsBoolean()
  smsInvite: boolean;

  /**
   * Enable Email Invite
   * @example 'true/false'
   */
  @IsBoolean()
  emailInvite: boolean;

  /**
   * Let members assign measurements to other tailors
   * @example 'true/false'
   */
  @IsBoolean()
  membersAssign: boolean;

  /**
   * Assign all group measurements to this tailor
   * @example 'true/false'
   */
  @IsBoolean()
  groupTailor: boolean;

  /**
   * I want this tailor to sew my event outfit(s)
   * @example 'true/false'
   */

  @IsBoolean()
  useTailor: boolean;

  /**
   * Event Id
   * @example '5895u36bh36bhj635u8y5'
   */
  @IsNotEmpty()
  @IsString()
  eventId: string;

  /**
   * GroupId Id
   * @example '5895u36bh36bhj635u8y5'
   */
  @IsString()
  groupId: string;

  /**
   * GroupId Id
   * @example '5895u36bh36bhj635u8y5'
   */
  @IsString()
  measurementId: string;

  constructor(addTailorDto: Partial<AddTailorDto>) {
    Object.assign(this, addTailorDto);
  }
}

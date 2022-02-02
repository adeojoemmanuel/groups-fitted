import { IsEnum, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { Gender } from '../../utils/enums/gender.enum';

export class ConfirmAutoSizeDto {
  /**
   * Group Id
   * @example 'efnjenfo4t6y575y4'
   */
  @IsString()
  group: string;

  /**
   * name of measurement
   * @example 'Stephen's Agabada'
   */
  @IsString()
  name: string;

  /**
   * Respective Measurement size
   * @example '10'
   */
  @IsString()
  neck: number;

  /**
   * Respective Measurement size
   * @example '10'
   */
  @IsString()
  wrist: number;

  /**
   * Respective Measurement size
   * @example '10'
   */
  @IsString()
  sleeveLength: number;

  /**
   * Respective Measurement size
   * @example '10'
   */
  @IsString()
  underArm: number;

  /**
   * Respective Measurement size
   * @example '10'
   */
  @IsString()
  chest: number;

  /**
   * Respective Measurement size
   * @example '10'
   */
  @IsString()
  shortSleeve: number;

  /**
   * Respective Measurement size
   * @example '10'
   */
  @IsString()
  threeQuarterSleeve: number;

  /**
   * Respective Measurement size
   * @example '10'
   */
  @IsString()
  shoulder: number;

  /**
   * Respective Measurement size
   * @example '10'
   */
  @IsString()
  roundElbow: number;

  /**
   * Respective Measurement size
   * @example '10'
   */
  @IsString()
  foreArm: number;

  /**
   * Respective Measurement size
   * @example '10'
   */
  @IsString()
  tommyCircumferenceTop: number;

  /**
   * Respective Measurement size
   * @example '10'
   */
  @IsString()
  ankle: number;

  /**
   * Respective Measurement size
   * @example '10'
   */
  @IsString()
  thighs: number;

  /**
   * Respective Measurement size
   * @example '10'
   */

  crotchLength: number;

  /**
   * Respective Measurement size
   * @example '10'
   */
  @IsString()
  roundKnee: number;

  /**
   * Respective Measurement size
   * @example '10'
   */
  @IsString()
  trouserWaist: number;

  /**
   * Respective Measurement size
   * @example '10'
   */
  @IsString()
  trouserInseam: number;

  /**
   * Respective Measurement size
   * @example '10'
   */
  @IsString()
  trouserHip: number;

  /**
   * Respective Measurement size
   * @example '10'
   */
  @IsString()
  trouserLength: number;

  /**
   * Respective Measurement size
   * @example '10'
   */

  shoeSize: number;
}

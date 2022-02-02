import { IsString } from 'class-validator';

export class MeasurementFavouriteDto {
  /**
   * measurement ID
   * @example '949949943l4llnnj3800844'
   */
  @IsString()
  id: string;
}

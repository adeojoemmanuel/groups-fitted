import { IsString } from 'class-validator';

export class DownloadMeasurementDto {
  /**
   * measurement ID
   * @example '949949943l4llnnj3800844'
   */
  @IsString()
  id: string;

  /**
   * measurement ID
   * @example '+2348102022543'
   */
  @IsString()
  phoneNumber: string;
}

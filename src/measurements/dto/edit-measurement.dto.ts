import { IsNotEmpty, IsString } from 'class-validator';

export class EditMeasurementDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

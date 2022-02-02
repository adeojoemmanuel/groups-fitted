import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SkipAutoSizeMeasurementDto {
  @IsOptional()
  @IsNumber()
  head: number;

  @IsOptional()
  @IsNumber()
  top: number;

  @IsOptional()
  @IsNumber()
  waist_circum_preferred: number;

  @IsOptional()
  @IsNumber()
  trouser_length_preferred: number;

  @IsOptional()
  @IsString()
  sleeve_type: string;

  @IsOptional()
  @IsNumber()
  height: number;

  @IsOptional()
  @IsNumber()
  weight: number;

  @IsOptional()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsString()
  gender: string;

  @IsOptional()
  @IsString()
  fit_preference: string;

  constructor(skipData: Partial<SkipAutoSizeMeasurementDto>) {
    Object.assign(this, skipData);
  }
}

import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { Features } from '../models/features.enum';

export class FeatureRequestDto {
  @IsEnum(Features)
  feature: string;
}

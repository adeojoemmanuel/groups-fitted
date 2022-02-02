import {
  IsDate,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Gender } from '../../utils/enums/gender.enum';
import { EventRole } from '../models/event-role.enum';
import { EventType } from '../models/event-type.enum';

export class UpdateEventDto {
  @IsMongoId()
  id: string;

  @MinLength(1)
  @IsOptional()
  name: string;

  @IsOptional()
  @IsEnum(EventType)
  type: string;

  @IsOptional()
  @IsDateString()
  date: Date;

  @IsOptional()
  @IsEnum(EventRole)
  role: string;

  @IsOptional()
  @IsString({ each: true })
  images: string[];

  @IsOptional()
  @IsString({ each: true })
  newImages: string[];

  @IsOptional()
  @IsString({ each: true })
  deletedImages: string[];

  constructor(updateEventDto: Partial<UpdateEventDto>) {
    Object.assign(this, updateEventDto);
  }
}

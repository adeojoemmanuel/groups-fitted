import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { Gender } from '../../utils/enums/gender.enum';
import { EventRole } from '../models/event-role.enum';
import { EventType } from '../models/event-type.enum';

export class CreateEventDto {
  @MinLength(1)
  name: string;

  @IsEnum(EventType)
  type: string;

  @IsDateString()
  date: Date;

  @IsEnum(EventRole)
  role: string;

  @IsEnum(Gender)
  gender: string;

  @IsOptional()
  @IsNotEmpty()
  groupName?: string;

  constructor(createEventDto: Partial<CreateEventDto>) {
    Object.assign(this, createEventDto);
  }
}

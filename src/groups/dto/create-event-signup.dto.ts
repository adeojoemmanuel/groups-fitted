import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinDate,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { OutfitBuyerSignupDto } from '../../auth/dtos/outfit-buyer.signup.dto';
import { Gender } from '../../utils/enums/gender.enum';
import { EventRole } from '../models/event-role.enum';
import { EventType } from '../models/event-type.enum';

export class CreateEventAndSignupDto {
  @MinLength(1)
  name: string;

  @IsEnum(EventType)
  type: string;

  date: Date;

  @IsEnum(Gender)
  gender: string;

  @IsEnum(EventRole)
  role: string;

  @IsOptional()
  @IsNotEmpty()
  groupName?: string;

  @ValidateNested()
  // @IsDefined()
  @Type(() => OutfitBuyerSignupDto)
  outfitBuyer: OutfitBuyerSignupDto;

  constructor(eventAndSignupDto: Partial<CreateEventAndSignupDto>) {
    Object.assign(this, eventAndSignupDto);
  }
}

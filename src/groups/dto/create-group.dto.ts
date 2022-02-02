import { IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Gender } from '../../utils/enums/gender.enum';

export class CreateGroupDto {
  @MinLength(1)
  eventId: string;

  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsEnum(Gender)
  gender: string;

  constructor(createGroupDto: Partial<CreateGroupDto>) {
    Object.assign(this, createGroupDto);
  }
}

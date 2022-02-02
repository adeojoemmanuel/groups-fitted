import { IsString, Length } from 'class-validator';

export class RecipientInviteDto {
  @IsString()
  @Length(8, 8)
  code: string;
}

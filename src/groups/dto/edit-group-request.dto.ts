import { IsNotEmpty, IsString } from 'class-validator';

export class EditGroupDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

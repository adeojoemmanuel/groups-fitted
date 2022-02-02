import { IsString } from 'class-validator';

export class FetchInviteeDto {
  /**
   * ID in tailor's invite link
   * @example '949949943l4llnnj3800844'
   */
  @IsString()
  id: string;

  /**
   * invite code in talors invite link
   * @example 'uuu4u4u4x'
   */
  @IsString()
  inviteCode: string;
}

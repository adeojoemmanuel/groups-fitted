import { MinLength } from 'class-validator';

export class RemoveRecipientDto {
  @MinLength(1)
  groupId: string;

  @MinLength(1)
  outfitBuyerId: string;

  constructor(removeRecipientDto: Partial<RemoveRecipientDto>) {
    Object.assign(this, removeRecipientDto);
  }
}

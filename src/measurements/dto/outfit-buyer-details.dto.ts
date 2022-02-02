import { Group } from '../../groups/models/group.model';
import { OutfitBuyer } from '../../users/models/outfit-buyer.schema';

export class OutfitBuyerDetailsDto {
  outfitBuyer: OutfitBuyer;
  eventAndGroups: object[];
}

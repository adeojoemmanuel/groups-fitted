import { OutfitBuyer } from '../../users/models/outfit-buyer.schema';
import { GroupOutfitBuyer } from '../models/group-outfit-buyers';
export class AcceptInviteResponseDto {
  accessToken: string;
  outfitBuyer: OutfitBuyer;
  groupOutfitBuyer: GroupOutfitBuyer;
}

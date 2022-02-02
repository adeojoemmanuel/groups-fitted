import { OutfitBuyer } from 'src/users/models/outfit-buyer.schema';
import { Event } from '../models/event.model';
import { Group } from '../models/group.model';
export class FirstEventResponseDto {
  accessToken: string;
  outfitBuyer: OutfitBuyer;
  group: Group;
  event: Event;
}

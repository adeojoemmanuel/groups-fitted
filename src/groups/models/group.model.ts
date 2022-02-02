import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { OutfitBuyer } from '../../users/models/outfit-buyer.schema';
import { UserAccount } from '../../users/models/user-account.schema';
import { Gender } from '../../utils/enums/gender.enum';
import { Event } from './event.model';

export type GroupDocument = Group & mongoose.Document;

@Schema({ timestamps: true })
export class Group {
  id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'OutfitBuyer' })
  initiator: OutfitBuyer;

  @Prop({
    type: String,
    required: false,
  })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Event' })
  event: Event;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OutfitBuyer' }],
  })
  admins: OutfitBuyer[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OutfitBuyer' }],
  })
  members: OutfitBuyer[];

  @Prop({
    type: String,
    required: true,
    enum: [Gender.Male, Gender.Female],
  })
  gender: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { OutfitBuyer } from '../../users/models/outfit-buyer.schema';
import { EventType } from './event-type.enum';
import { Group } from './group.model';

export type EventDocument = Event & mongoose.Document;

@Schema({ timestamps: true })
export class Event {
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  link: string;

  @Prop({
    type: String,
    required: true,
  })
  type: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OutfitBuyer' }],
  })
  admins: OutfitBuyer[];

  @Prop({
    type: [[String]],
  })
  images: string[][];

  @Prop({
    type: Object,
    default: {},
    select: false,
  })
  imagesMetadata: object;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'OutfitBuyer' })
  creator: OutfitBuyer | string;

  @Prop({
    type: String,
    required: true,
  })
  role: string;

  @Prop({ required: true })
  date: Date;

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }] })
  // groups: Group[];
}

export const EventSchema = SchemaFactory.createForClass(Event);

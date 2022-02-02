import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Event } from '../../groups/models/event.model';
import { OutfitBuyer } from '../../users/models/outfit-buyer.schema';
import { Tailor } from '../../users/models/tailor.schema';

export type MeasurementRequestDocument = MeasurementRequest & mongoose.Document;

@Schema({ timestamps: true })
export class MeasurementRequest {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OutfitBuyer',
  })
  outfitBuyer: OutfitBuyer;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tailor' })
  tailor: Tailor;

  @Prop({
    type: String,
    required: true,
  })
  tailorEmail: string;

  @Prop({ type: Object, required: true })
  measurement: object;

  @Prop({ required: true, type: Boolean, default: false })
  accepted: boolean;

  @Prop({ required: true, type: Boolean, default: false })
  membersAssign: boolean;

  @Prop({ required: true, type: Boolean, default: false })
  groupTailor: boolean;

  @Prop({ required: true, type: Boolean, default: false })
  useTailor: boolean;

  @Prop({ required: true, type: String, ref: 'Event' })
  event: string;

  @Prop({ required: true, type: String })
  group: string;
}

export const MeasurementRequestSchema =
  SchemaFactory.createForClass(MeasurementRequest);

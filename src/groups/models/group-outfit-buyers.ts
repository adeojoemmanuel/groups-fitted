import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { boolean } from 'joi';
import * as mongoose from 'mongoose';
import { OutfitBuyer } from '../../users/models/outfit-buyer.schema';
import { UserAccount } from '../../users/models/user-account.schema';
import { Gender } from '../../utils/enums/gender.enum';
import { Group } from './group.model';

export type GroupOutfitBuyerDocument = GroupOutfitBuyer & mongoose.Document;

@Schema({ timestamps: true })
export class GroupOutfitBuyer {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Group' })
  group: Group | string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'OutfitBuyer' })
  outfitBuyer: OutfitBuyer | string;

  @Prop({ required: true, type: Boolean, default: false })
  isAdmin: boolean;

  @Prop({ required: true, type: Boolean })
  useInitiatorTailor: boolean;

  @Prop({ required: true, type: Boolean })
  canChooseTailor: boolean;

  @Prop({ required: true, type: Boolean })
  useInitiatorMeasurementToken: boolean;

  @Prop({
    type: String,
    required: true,
  })
  measurementStatus: string;

  @Prop({
    type: String,
    required: true,
  })
  paymentStatus: string;

  @Prop({
    type: String,
    required: true,
  })
  paymentMethod: string;

  @Prop({ required: true, type: Date })
  dateAdded: Date;

  @Prop({ required: true, type: Date })
  dateJoined: Date;
}

export const GroupOutfitBuyerSchema =
  SchemaFactory.createForClass(GroupOutfitBuyer);

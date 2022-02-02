import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { object } from 'joi';
import * as mongoose from 'mongoose';
import { type } from 'os';
import { UserAccount } from './user-account.schema';

export type OutfitBuyerDocument = OutfitBuyer & mongoose.Document;

@Schema({ timestamps: true })
export class OutfitBuyer {
  id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserAccount' })
  userAccount: UserAccount;

  @Prop({ type: [Object], default: [], required: false })
  measurements: object[];
}

export const OutfitBuyerSchema = SchemaFactory.createForClass(OutfitBuyer);

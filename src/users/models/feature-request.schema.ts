import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { UserAccount } from './user-account.schema';

export type FeatureRequestDocument = FeatureRequest & mongoose.Document;

@Schema({ timestamps: true })
export class FeatureRequest {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  feature: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserAccount' })
  userId: string;
}

export const FeatureRequestSchema =
  SchemaFactory.createForClass(FeatureRequest);

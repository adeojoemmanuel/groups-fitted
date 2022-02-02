import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { UserAccount } from './user-account.schema';

export type EmbroidererDocument = Embroiderer & mongoose.Document;

@Schema({ timestamps: true })
export class Embroiderer {
  @Prop({ required: true })
  location: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserAccount' })
  userAccount: UserAccount;
}

export const EmbroidererSchema = SchemaFactory.createForClass(Embroiderer);

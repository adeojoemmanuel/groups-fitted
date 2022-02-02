import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Gender } from '../../utils/enums/gender.enum';
import { UserAccount } from './user-account.schema';

export type TailorDocument = Tailor & mongoose.Document;

@Schema({ timestamps: true })
export class Tailor {
  @Prop({ required: true })
  location: string;

  @Prop({
    type: String,
    required: true,
    enum: [Gender.Male, Gender.Female, Gender.Both],
  })
  customerCategory: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserAccount' })
  userAccount: UserAccount;
}

export const TailorSchema = SchemaFactory.createForClass(Tailor);

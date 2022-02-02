import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Gender } from '../../utils/enums/gender.enum';
import { UserAccount } from './user-account.schema';

export type FabricSellerDocument = FabricSeller & mongoose.Document;

@Schema({ timestamps: true })
export class FabricSeller {
  @Prop({ required: true, type: String })
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

export const FabricSellerSchema = SchemaFactory.createForClass(FabricSeller);

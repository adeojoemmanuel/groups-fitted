import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Measurement } from '../../measurements/models/measurement.model';
import { Gender } from '../../utils/enums/gender.enum';
import { Embroiderer } from './embroiderer.schema';
import { FabricSeller } from './fabric-seller.schema';
import { OutfitBuyer } from './outfit-buyer.schema';
import { userRoles } from './roles.enum';
import { Tailor } from './tailor.schema';

export type UserAccountDocument = UserAccount & mongoose.Document;

@Schema({ timestamps: true })
export class UserAccount {
  id: string;
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ select: false })
  password: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: String })
  location: string;

  @Prop({ required: true, default: true })
  isConfirmed: boolean;

  @Prop({
    type: String,
    required: true,
    enum: [Gender.Male, Gender.Female],
  })
  gender: string;

  @Prop({
    type: [String],
    enum: userRoles,
    default: [],
    required: true,
  })
  role: string[];
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Measurement' })
  measurement: Measurement | string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'OutfitBuyer' })
  outfitBuyerProfile: OutfitBuyer;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tailor' })
  tailorProfile: Tailor;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Embroiderer' })
  embroidererProfile: Embroiderer;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'FabricSeller' })
  fabricSellerProfile: FabricSeller;

  constructor(userAccount: Partial<UserAccount>) {
    Object.assign(this, userAccount);
  }
}

export const UserAccountSchema = SchemaFactory.createForClass(UserAccount);

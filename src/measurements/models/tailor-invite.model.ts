import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { OutfitBuyer } from '../../users/models/outfit-buyer.schema';
import { Tailor } from '../../users/models/tailor.schema';
import { Gender } from '../../utils/enums/gender.enum';
import { MeasurementRequest } from './measurement-request.model';

export type TailorInviteDocument = TailorInvite & mongoose.Document;

@Schema({ timestamps: true })
export class TailorInvite {
  id: string;

  @Prop({ required: true, type: String, unique: true })
  code: string;

  @Prop({ required: true, type: String })
  firstName: string;

  @Prop({ required: true, type: String })
  lastName: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: Boolean, default: false })
  accepted: boolean;

  @Prop({ required: true, type: Boolean, default: false })
  smsInvite: boolean;

  @Prop({ required: true, type: Boolean, default: false })
  emailInvite: boolean;

  @Prop({
    type: String,
    required: true,
    enum: [Gender.Male, Gender.Female],
  })
  gender: string;

  @Prop({ required: true, type: String })
  phoneNumber: string;

  @Prop([
    {
      required: true,
      type: mongoose.Schema.Types.String,
      ref: 'MeasurementRequest',
    },
  ])
  measurementRequests: [];
}

export const TailorInviteSchema = SchemaFactory.createForClass(TailorInvite);

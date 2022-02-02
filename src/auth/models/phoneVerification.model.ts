import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type OtpVerificationDocument = OtpVerification & mongoose.Document;

@Schema({ timestamps: true })
export class OtpVerification {
  [x: string]: any;
  @Prop({ required: true })
  otpCode: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ required: true })
  expires: Date;

  constructor(otpVerification: Partial<OtpVerification>) {
    Object.assign(this, otpVerification);
  }
}

export const OtpVerificationSchema =
  SchemaFactory.createForClass(OtpVerification);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type EmailVerificationDocument = EmailVerification & mongoose.Document;

@Schema({ timestamps: true })
export class EmailVerification {
  [x: string]: any;
  @Prop({ required: true, unique: true })
  confirmationCode: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  expires: Date;

  constructor(emailVerification: Partial<EmailVerification>) {
    Object.assign(this, emailVerification);
  }
}

export const EmailVerificationSchema =
  SchemaFactory.createForClass(EmailVerification);

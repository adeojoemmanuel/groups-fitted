import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type PasswordRecoveryDocument = PasswordRecovery & mongoose.Document;

@Schema({ timestamps: true })
export class PasswordRecovery {
  @Prop({ required: true, type: String })
  recoveryCode: string;

  @Prop({ required: true, unique: true, type: String })
  email: string;

  @Prop({ required: true, type: Date })
  expires: Date;
}

export const PasswordRecoverySchema =
  SchemaFactory.createForClass(PasswordRecovery);

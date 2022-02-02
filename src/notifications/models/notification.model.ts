import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { UserAccount } from '../../users/models/user-account.schema';

export type NotificationDocument = Notification & mongoose.Document;

@Schema({ timestamps: true })
export class Notification {
  id: string;

  @Prop({ required: true })
  caption: string;

  @Prop({ required: true })
  fullMessage: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserAccount',
  })
  receiver: UserAccount | string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserAccount',
  })
  actor: UserAccount | string;

  @Prop({ required: true, type: Date, default: new Date() })
  date?: Date;

  @Prop({ required: true, type: Boolean, default: false })
  viewed?: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

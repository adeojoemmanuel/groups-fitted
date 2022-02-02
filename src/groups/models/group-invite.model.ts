import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Gender } from '../../utils/enums/gender.enum';

export type GroupRecipientInviteDocument = GroupRecipientInvite &
  mongoose.Document;
@Schema({ timestamps: true })
export class GroupRecipientInvite {
  id: string;

  @Prop({ required: true, type: String, unique: true })
  code: string;

  @Prop({ required: true, type: String })
  groupId: string;

  @Prop({ required: true, type: String })
  eventUrl: string;

  @Prop({ required: true, type: Date })
  invitationDate: Date;

  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: Boolean, default: false })
  accepted: boolean;

  @Prop({
    type: String,
    required: true,
    enum: [Gender.Male, Gender.Female],
  })
  gender: string;

  @Prop({ type: String })
  phoneNumber: string;

  @Prop({ required: true, type: Boolean })
  useInitiatorTailor: boolean;

  @Prop({ required: true, type: Boolean })
  canChooseTailor: boolean;

  @Prop({ required: true, type: Boolean })
  useInitiatorMeasurementToken: boolean;

  @Prop({ type: String })
  location: string;
}

export const GroupRecipientInviteSchema =
  SchemaFactory.createForClass(GroupRecipientInvite);

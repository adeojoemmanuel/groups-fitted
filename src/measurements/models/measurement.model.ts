import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { MeasurementMethod } from './measurement-method.enum';

export type MeasurementDocument = Measurement & mongoose.Document;

@Schema({ timestamps: true })
export class Measurement {
  id: string;

  @Prop({
    type: String,
    required: true,
    enum: [MeasurementMethod.AutoSize, MeasurementMethod.Manual],
  })
  method: string;

  @Prop({ type: Object })
  skipAutosizeData: object;

  @Prop({ type: Object })
  measurementData: object;

  @Prop({ type: Object })
  autoSizeMeasurementData: object;

  @Prop({ type: Object })
  manualMeasurementData: object;

  @Prop({ default: false, type: Boolean })
  favourite: boolean;

  @Prop({ type: Date })
  dateTaken: Date;
}

export const MeasurementSchema = SchemaFactory.createForClass(Measurement);

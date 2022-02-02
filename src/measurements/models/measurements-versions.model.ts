import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Group } from 'src/groups/models/group.model';
import { OutfitBuyer } from 'src/users/models/outfit-buyer.schema';

export type MeasurementVersionsDocument = MeasurementVersions &
  mongoose.Document;

@Schema({ timestamps: true })
export class MeasurementVersions {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OutfitBuyer',
  })
  outfitBuyer: string;

  @Prop({
    required: true,
    type: [Object],
    default: [],
  })
  measurements: object[];
}

export const MeasureVersionsSchema =
  SchemaFactory.createForClass(MeasurementVersions);

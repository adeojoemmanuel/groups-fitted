import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { ImageUploaderModule } from 'src/utils/imageUploader/imageUploader.module';
import { MessagingModule } from 'src/utils/messaging/messaging.module';
import { UsersModule } from '../users/users.module';
import { MeasurementsController } from './controllers/measurements.controller';
import {
  MeasurementRequest,
  MeasurementRequestSchema,
} from './models/measurement-request.model';
import { Measurement, MeasurementSchema } from './models/measurement.model';
import {
  MeasurementVersions,
  MeasureVersionsSchema,
} from './models/measurements-versions.model';
import { TailorInvite, TailorInviteSchema } from './models/tailor-invite.model';
import { MeasurementsService } from './services/measurements.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Measurement.name, schema: MeasurementSchema },
      { name: MeasurementRequest.name, schema: MeasurementRequestSchema },
      { name: TailorInvite.name, schema: TailorInviteSchema },
      { name: MeasurementVersions.name, schema: MeasureVersionsSchema },
    ]),
    UsersModule,
    MessagingModule,
    NotificationsModule,
    ImageUploaderModule,
  ],
  controllers: [MeasurementsController],
  providers: [MeasurementsService],
})
export class MeasurementsModule {}

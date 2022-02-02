import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MeasurementRequest,
  MeasurementRequestSchema,
} from 'src/measurements/models/measurement-request.model';
import {
  Measurement,
  MeasurementSchema,
} from 'src/measurements/models/measurement.model';
import {
  TailorInvite,
  TailorInviteSchema,
} from 'src/measurements/models/tailor-invite.model';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { UsersModule } from 'src/users/users.module';
import { ImageUploaderModule } from 'src/utils/imageUploader/imageUploader.module';
import { MailingModule } from 'src/utils/mailing/mailing.module';
import { MessagingModule } from 'src/utils/messaging/messaging.module';
import { TailorController } from './controller/tailor.controller';
import { TailorService } from './service/tailor.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Measurement.name, schema: MeasurementSchema },
      { name: MeasurementRequest.name, schema: MeasurementRequestSchema },
      { name: TailorInvite.name, schema: TailorInviteSchema },
    ]),
    UsersModule,
    MessagingModule,
    NotificationsModule,
    ImageUploaderModule,
    MailingModule,
  ],
  controllers: [TailorController],
  providers: [TailorService],
})
export class TailorModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { config } from './config';
import configuration from './config/configuration';
import { GroupsModule } from './groups/groups.module';
import { MeasurementsModule } from './measurements/measurements.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TailorModule } from './tailor/tailor.module';
import { UsersModule } from './users/users.module';
import { ImageUploaderModule } from './utils/imageUploader/imageUploader.module';
import { LoggerModule } from './utils/logger/logger.module';
import { MailingModule } from './utils/mailing/mailing.module';
import { MessagingModule } from './utils/messaging/messaging.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    MongooseModule.forRoot(config.db.uri),
    GroupsModule,
    UsersModule,
    LoggerModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    MailingModule,
    MessagingModule,
    NotificationsModule,
    MeasurementsModule,
    TailorModule,
    ImageUploaderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

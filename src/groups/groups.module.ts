import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { ImageUploaderModule } from '../utils/imageUploader/imageUploader.module';
import { MailingModule } from '../utils/mailing/mailing.module';
import { MessagingModule } from '../utils/messaging/messaging.module';
import { GroupsController } from './controllers/groups.controller';
import { Event, EventSchema } from './models/event.model';
import {
  GroupRecipientInvite,
  GroupRecipientInviteSchema,
} from './models/group-invite.model';
import {
  GroupOutfitBuyer,
  GroupOutfitBuyerSchema,
} from './models/group-outfit-buyers';
import { Group, GroupSchema } from './models/group.model';
import { GroupsService } from './services/groups.service';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: Event.name, schema: EventSchema },
      { name: GroupOutfitBuyer.name, schema: GroupOutfitBuyerSchema },
      { name: GroupRecipientInvite.name, schema: GroupRecipientInviteSchema },
    ]),
    AuthModule,
    MailingModule,
    MessagingModule,
    NotificationsModule,
    ImageUploaderModule,
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService, MongooseModule],
})
export class GroupsModule {}

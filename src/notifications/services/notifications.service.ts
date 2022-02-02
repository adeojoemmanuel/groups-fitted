import {
  BadRequestException,
  Injectable,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as PushNotifications from '@pusher/push-notifications-server';
import { Model } from 'mongoose';
import { config } from '../../config';
import { UserAccount } from '../../users/models/user-account.schema';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import {
  Notification,
  NotificationDocument,
} from '../models/notification.model';

@Injectable()
export class NotificationsService {
  pusherBeamsClient: any;
  constructor(
    @InjectModel(Notification.name)
    private NotificationModel: Model<NotificationDocument>,
  ) {
    const options = {
      secretKey: config.pusher.secretKey,
      instanceId: config.pusher.instanceId,
    };
    this.pusherBeamsClient = new PushNotifications(options);
  }

  async getBeamToken(user: UserAccount, userId: string): Promise<any> {
    if (user.id !== userId) {
      throw new BadRequestException('Inconsistent Pusher request');
    } else {
      const beamsToken = await this.pusherBeamsClient.generateToken(user.id);
      return JSON.stringify(beamsToken);
    }
  }

  publishNotificationToUser(userId, title, body): void {
    this.pusherBeamsClient
      .publishToUsers([userId], {
        web: {
          time_to_live: 86400,
          notification: {
            title,
            body,
          },
          // deep_link: 'dummy',
          // icon: 'https://example.com/img/notification-icon.png',
        },
      })
      .then((publishResponse) => {
        console.log('Just published:', publishResponse.publishId);
      })
      .catch((error) => {
        console.log('Pusher Notification Error:', error);
      });
  }

  create(createNotificationDto: CreateNotificationDto): any {
    return 'This action adds a new notification';
  }

  createEvent(
    initiatorName: string,
    eventDate: string,
    eventUrl: string,
    eventName: string,
    actor: string,
    receiver: string,
  ): Promise<Notification> {
    let caption: string, fullMessage: string;
    caption = `Event created by ${initiatorName}`;
    fullMessage = `🎉Yipee! You just created an event for ${eventDate} called ${eventName}. Use your ${eventUrl} to coordinate all tailoring for it!`;

    const notification: any = new this.NotificationModel({
      caption,
      fullMessage,
      receiver: actor,
      actor,
    });
    this.publishNotificationToUser(receiver, caption, fullMessage);
    return notification.save();
  }

  addGroupRecipient(
    recipientName: string,
    actor: string,
    receiver: string,
    canUseOwnTailor: boolean,
  ): Promise<Notification> {
    let caption: string, fullMessage: string;
    if (canUseOwnTailor) {
      caption = `Invitation to ${recipientName} sent`;
      fullMessage = `Yipee! You just added ${recipientName} to your group for your event. They will show up in your dashboard when the invitation is accepted, and you’ll be able to track measurement status for them`;
    } else {
      caption = `Invitation to ${recipientName} sent. Change Permissions`;
      fullMessage = `Yipee! You just added ${recipientName} to your group for your event. They will show up in your dashboard when the invitation is accepted. You haven’t given them permission to send measurements
      to any tailor, you can change this permission at any time in your dashboard`;
    }

    const notification: any = new this.NotificationModel({
      caption,
      fullMessage,
      receiver: actor,
      actor,
    });
    this.publishNotificationToUser(receiver, caption, fullMessage);
    return notification.save();
  }

  editRecipientInvite(
    recipientName: string,
    actor: string,
    receiver: string,
  ): Promise<Notification> {
    let caption: string, fullMessage: string;
    caption = `New Invite sent to ${recipientName}`;
    fullMessage = `You just updated contact details of ${recipientName} from your group. After they accept the invite, you can’t make any more changes to their profile`;

    const notification: any = new this.NotificationModel({
      caption,
      fullMessage,
      receiver: actor,
      actor,
    });
    this.publishNotificationToUser(receiver, caption, fullMessage);
    return notification.save();
  }

  async deleteGroupRecipient(
    recipientName: string,
    initiatorName: string,
    actor: string,
    receiver: string,
  ): Promise<any> {
    let captionToActor: string, fullMessageToActor: string;
    captionToActor = `${recipientName} successfully removed`;
    fullMessageToActor = `You just removed ${recipientName} from your group. They will no longer show up in your group or on your event dashboard`;

    const notificationToActor: any = new this.NotificationModel({
      caption: captionToActor,
      fullMessage: fullMessageToActor,
      receiver: actor,
      actor,
    });
    this.publishNotificationToUser(actor, captionToActor, fullMessageToActor);
    await notificationToActor.save();

    let captionToReceiver: string, fullMessageToReceiver: string;
    captionToReceiver = `${initiatorName} just revoked your access to their group`;
    fullMessageToReceiver = `Unfortunately, ${initiatorName} just revoked your access to their group. You will no longer have access to their group event page`;

    const notificationToReceiver: any = new this.NotificationModel({
      caption: captionToReceiver,
      fullMessage: fullMessageToReceiver,
      receiver,
      actor,
    });
    this.publishNotificationToUser(
      receiver,
      captionToReceiver,
      fullMessageToReceiver,
    );
    return notificationToReceiver.save();
  }

  async acceptGroupInvite(
    recipientName: string,
    actor: string,
    receiver: string,
  ): Promise<any> {
    let captionToReceiver: string, fullMessageToReceiver: string;
    captionToReceiver = `${recipientName} accepted your invite to join your group`;
    fullMessageToReceiver = `${recipientName} accepted your invite to join your group for your event. Their user profile has been created and once they input their measurements, these will show up on your group and event dashboard.`;

    const notificationToReceiver: any = new this.NotificationModel({
      caption: captionToReceiver,
      fullMessage: fullMessageToReceiver,
      receiver, // initiator
      actor, // recipient
    });
    this.publishNotificationToUser(
      receiver,
      captionToReceiver,
      fullMessageToReceiver,
    );
    await notificationToReceiver.save();
  }

  async acceptGroupInviteToUseInitiatorTailor(
    recipientName: string,
    initiatorName: string,
    actor: string,
    receiver: string,
    eventName: string,
  ): Promise<any> {
    let captionToActor: string, fullMessageToActor: string;
    captionToActor = `Welcome to Fitted! ${recipientName}`;
    fullMessageToActor = `Welcome to Fitted! FYI, ${initiatorName} set your measurements to be sent to their tailor automatically. To change this setting, you’ll need to ask for a change to your sharing permissions first`;

    const notificationToActor: any = new this.NotificationModel({
      caption: captionToActor,
      fullMessage: fullMessageToActor,
      receiver: actor,
      actor,
    });
    this.publishNotificationToUser(actor, captionToActor, fullMessageToActor);
    await notificationToActor.save();

    let captionToReceiver: string, fullMessageToReceiver: string;
    captionToReceiver = `${recipientName} accepted your invite to join your group`;
    fullMessageToReceiver = `${recipientName} accepted your invite to join your group for ${eventName}. Once they accept the invite, they’ll show up on your dashboard. We’ll automatically send their measurements to your tailor. If you changed your mind about this setting, you can change this permission in your dashboard`;

    const notificationToReceiver: any = new this.NotificationModel({
      caption: captionToReceiver,
      fullMessage: fullMessageToReceiver,
      receiver,
      actor,
    });
    this.publishNotificationToUser(
      receiver,
      captionToReceiver,
      fullMessageToReceiver,
    );
    return notificationToReceiver.save();
  }

  async addMeasurement(): Promise<any> {
    return true;
  }

  async sendMeasurement(): Promise<any> {
    return true;
  }

  async acceptTailorInvite(): Promise<any> {
    return true;
  }

  async changeEventDetails(): Promise<any> {
    return true;
  }

  async requestOutfitBuyerMeasurement(): Promise<any> {
    return true;
  }

  async requestEditMeasurementPermission(): Promise<any> {
    return true;
  }

  sendMeasurementTailor(
    recipientName: string,
    actor: string,
    receiver: string,
  ): Promise<Notification> {
    let caption: string, fullMessage: string;

    caption = `measurement of ${actor} sent`;
    fullMessage = `Yipee! a new measurement has been sent to ${recipientName} `;

    const notification: any = new this.NotificationModel({
      caption,
      fullMessage,
      receiver: actor,
      actor,
    });
    return notification.save();
  }

  fetchUserNotifications(): any {
    return true;
  }

  async viewNotification(notificationId: string): Promise<Notification> {
    return this.NotificationModel.findByIdAndUpdate(
      notificationId,
      {
        viewed: true,
      },
      {
        new: true,
      },
    ).exec();
  }

  async getUserNotifications(
    user: UserAccount,
    read: boolean,
    unread: boolean,
    limit: number = 10,
    page: number = 1,
    sortBy: string = 'createdAt',
    sortDirection: string = 'DESC',
  ): Promise<any> {
    const queryObj: any = { receiver: user.id };
    if (read && !unread) {
      queryObj.viewed = true;
    } else if (!read && unread) {
      queryObj.viewed = false;
    }

    let query = this.NotificationModel.find(queryObj);
    if (sortBy) {
      query = query.sort({
        createdAt: sortDirection === 'DESC' ? 'descending' : 'ascending',
      });
    }
    const total = await this.NotificationModel.count(queryObj).exec();
    const data = await query
      .populate({ path: 'actor', select: 'firstName lastName' })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const unreadFilter: any = { ...queryObj };
    unreadFilter.viewed = false;
    const totalUnread = await this.NotificationModel.count(unreadFilter).exec();

    return {
      data,
      total,
      page,
      totalUnread,
      last_page: Math.ceil(total / limit),
    };
  }
}

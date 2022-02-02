import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserAccount } from '../../users/models/user-account.schema';
import { LoggedInUser } from '../../utils/decorators/current-user.decorator';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { Notification } from '../models/notification.model';
import { NotificationsService } from '../services/notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto): any {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get('/beams-auth')
  @UseGuards(JwtAuthGuard)
  getBeamToken(
    @LoggedInUser() user: UserAccount,
    @Query('user_id') userId: string,
  ): any {
    return this.notificationsService.getBeamToken(user, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserNotifications(
    @LoggedInUser() user: UserAccount,
    @Query('read') read: boolean = false,
    @Query('unread') unread: boolean = true,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
  ): Promise<Notification[]> {
    return this.notificationsService.getUserNotifications(
      user,
      read,
      unread,
      limit,
      page,
      sortBy,
      sortDirection,
    );
  }

  @Patch('/:notificationId/viewed')
  viewNotification(
    @Param('notificationId') notificationId: string,
  ): Promise<Notification> {
    return this.notificationsService.viewNotification(notificationId);
  }
}

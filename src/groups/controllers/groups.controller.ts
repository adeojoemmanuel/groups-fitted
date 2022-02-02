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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OutfitBuyerDetailsDto } from '../../measurements/dto/outfit-buyer-details.dto';
import { userRoles } from '../../users/models/roles.enum';
import { UserAccount } from '../../users/models/user-account.schema';
import { LoggedInUser } from '../../utils/decorators/current-user.decorator';
import { AcceptInviteRequestDto } from '../dto/accept-invite-request.dto';
import { AcceptInviteResponseDto } from '../dto/accept-invite-response.dto';
import { AddRecipientDto } from '../dto/add-recipient.dto';
import { CreateEventAndSignupDto } from '../dto/create-event-signup.dto';
import { CreateEventDto } from '../dto/create-event.dto';
import { CreateGroupDto } from '../dto/create-group.dto';
import { EditRecipientDto } from '../dto/edit-recipient.dto';
import { FirstEventResponseDto } from '../dto/first-event-response.dto';
import { RecipientInviteDto } from '../dto/recipient-invite-code.dto';
import { RemoveRecipientDto } from '../dto/remove-recipient.dto';
import { Event } from '../models/event.model';
import { GroupRecipientInvite } from '../models/group-invite.model';
import { GroupOutfitBuyer } from '../models/group-outfit-buyers';
import { Group } from '../models/group.model';
import { GroupsService } from '../services/groups.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../utils/decorators/roles.decorator';
import { EditGroupDto } from '../dto/edit-group-request.dto';
import { EditGroupResonseDto } from '../dto/edit-group-response.dto';
import { UpdateEventDto } from '../dto/update-event.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post('/create-first-event')
  @UseInterceptors(FileInterceptor('file'))
  createEventAndSignup(
    @Body() createEventAndSignupDto: CreateEventAndSignupDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FirstEventResponseDto> {
    return this.groupsService.createEventAndSignup(
      createEventAndSignupDto,
      file,
    );
  }

  @Roles(userRoles.OutfitBuyer)
  @Post('/create-event')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  createEvent(
    @Body() createEventDto: CreateEventDto,
    @LoggedInUser() user,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return this.groupsService.createEvent(createEventDto, user, file, false);
  }

  @Roles(userRoles.OutfitBuyer)
  @Post('/update-event')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  updateEvent(
    @Body() updateEventDto: UpdateEventDto,
    @LoggedInUser() user,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Event> {
    return this.groupsService.updateEvent(updateEventDto, user, file);
  }

  @Roles(userRoles.OutfitBuyer)
  @Post('/update-group')
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateGroup(
    @Body() editgroupDto: EditGroupDto,
  ): Promise<EditGroupResonseDto> {
    return this.groupsService.EditGroup(editgroupDto);
  }

  @Roles(userRoles.OutfitBuyer)
  @Post('/send-batch-invites/:groupId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  sendBatchInvites(
    @Query('emails') emails: string,
    @Param('groupId') groupId: string,
    @LoggedInUser() user,
  ): Promise<any> {
    return this.groupsService.sendBatchInvites(emails, user, groupId);
  }

  @Roles(userRoles.OutfitBuyer)
  @Post('/add-group')
  @UseGuards(JwtAuthGuard, RolesGuard)
  addGroup(
    @LoggedInUser() user,
    @Body() createGroupDto: CreateGroupDto,
  ): Promise<Group> {
    return this.groupsService.addGroup(user, createGroupDto);
  }

  @Roles(userRoles.OutfitBuyer)
  @Get('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  getOutfitBuyerDetails(@LoggedInUser() user): Promise<any> {
    return this.groupsService.getOutfitBuyerGroups(user);
  }

  @Roles(userRoles.OutfitBuyer)
  @Get('/events-and-groups')
  @UseGuards(JwtAuthGuard, RolesGuard)
  getOutfitBuyerEventsAndGroups(
    @LoggedInUser() user,
  ): Promise<OutfitBuyerDetailsDto> {
    return this.groupsService.getOutfitBuyerEventsAndGroups(user);
  }

  @Get('/recipient-invitation')
  getGroupRecipientInvitation(
    @Query('inviteCode') inviteCode: string,
  ): Promise<GroupRecipientInvite> {
    return this.groupsService.getGroupRecipientInvitation(inviteCode);
  }

  @Post('/recipient-invitation')
  acceptGroupRecipientInvitation(
    @Body() acceptInviteRequestDto: AcceptInviteRequestDto,
  ): Promise<AcceptInviteResponseDto> {
    return this.groupsService.acceptGroupRecipientInvitation(
      acceptInviteRequestDto,
    );
  }

  @Roles(userRoles.OutfitBuyer)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/join-group')
  joinGroup(
    @Query('code') code: string,
    @LoggedInUser() user: UserAccount,
  ): Promise<Group> {
    return this.groupsService.joinGroup(code, user);
  }

  // @Post()
  // @UseGuards(JwtAuthGuard)
  // addTailor(@Body() createGroupDto: CreateGroupDto) {
  //   return this.groupsService.addGroup(createGroupDto);
  // }

  // @Post()
  // @UseGuards(JwtAuthGuard)
  // inviteGroupRecipient(@Body() createGroupDto: CreateGroupDto) {
  //   return this.groupsService.addGroup(createGroupDto);
  // }

  @Roles(userRoles.OutfitBuyer)
  @Post('/add-new-recipient-invite')
  @UseGuards(JwtAuthGuard, RolesGuard)
  addGroupRecipient(
    @Body() addRecipientDto: AddRecipientDto,
    @LoggedInUser() user: UserAccount,
  ): Promise<GroupRecipientInvite> {
    return this.groupsService.addRecipientToGroup(addRecipientDto, user);
  }

  @Roles(userRoles.OutfitBuyer)
  @Post('/edit-recipient-invite')
  @UseGuards(JwtAuthGuard, RolesGuard)
  editGroupRecipientInvite(
    @Body() editRecipientDto: EditRecipientDto,
    @LoggedInUser() user: UserAccount,
  ): Promise<GroupRecipientInvite> {
    return this.groupsService.editGroupRecipientInvitation(
      editRecipientDto,
      user,
    );
  }

  @Roles(userRoles.OutfitBuyer)
  @Post('/delete-recipient-invite')
  @UseGuards(JwtAuthGuard, RolesGuard)
  removeGroupRecipientInvite(
    // @Body() removeRecipientInviteDto: RemoveRecipientDto,
    @Query('code') code: string,
    @LoggedInUser() user: UserAccount,
  ): Promise<boolean> {
    return this.groupsService.removeGroupRecipientInvite(code, user);
  }

  @Roles(userRoles.OutfitBuyer)
  @Post('/remove-recipient')
  @UseGuards(JwtAuthGuard, RolesGuard)
  removeGroupRecipient(
    @Body() removeRecipientDto: RemoveRecipientDto,
    @LoggedInUser() user: UserAccount,
  ): Promise<boolean> {
    return this.groupsService.removeRecipientFromGroup(
      removeRecipientDto,
      user,
    );
  }

  @Roles(userRoles.OutfitBuyer)
  @Get('/:id/members')
  @UseGuards(JwtAuthGuard, RolesGuard)
  getGroupMembers(
    @Param('id') id: string,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
    @LoggedInUser() user: UserAccount,
  ): Promise<GroupOutfitBuyer[]> {
    return this.groupsService.getGroupMembers(id, skip, limit, user);
  }

  @Roles(userRoles.OutfitBuyer)
  @Get('/:id/invited-members')
  @UseGuards(JwtAuthGuard, RolesGuard)
  getGroupInvites(
    @Param('id') id: string,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
    @LoggedInUser() user: UserAccount,
  ): Promise<GroupRecipientInvite[]> {
    return this.groupsService.getGroupInvites(id, skip, limit, user);
  }

  @Get('/events/:eventUrl')
  getEventDetails(@Param('eventUrl') eventUrl: string): Promise<any> {
    return this.groupsService.getEventDetails(eventUrl);
  }

  @Get('/currentDate')
  getCurrentDate(): Date {
    return this.groupsService.getCurrentDate();
  }
}

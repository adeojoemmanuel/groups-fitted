import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import * as moment from 'moment';
import { Model } from 'mongoose';
import * as slug from 'slug';
import { OutfitBuyerSignupResponseDto } from '../../auth/dtos/outfit-buyer-signup-response.dto';
import { AuthService } from '../../auth/services/auth.service';
import { config } from '../../config/index';
import { OutfitBuyerDetailsDto } from '../../measurements/dto/outfit-buyer-details.dto';
import { NotificationsService } from '../../notifications/services/notifications.service';
import {
  OutfitBuyer,
  OutfitBuyerDocument,
} from '../../users/models/outfit-buyer.schema';
import {
  UserAccount,
  UserAccountDocument,
} from '../../users/models/user-account.schema';
import { UsersService } from '../../users/services/users.service';
import { LoggedInUser } from '../../utils/decorators/current-user.decorator';
import { ImageUploaderService } from '../../utils/imageUploader/imageUploader.service';
import { MailingService } from '../../utils/mailing/mailing.service';
import { MessagingService } from '../../utils/messaging/messaging.service';
import { AcceptInviteRequestDto } from '../dto/accept-invite-request.dto';
import { AcceptInviteResponseDto } from '../dto/accept-invite-response.dto';
import { AddRecipientDto } from '../dto/add-recipient.dto';
import { CreateEventAndSignupDto } from '../dto/create-event-signup.dto';
import { CreateEventDto } from '../dto/create-event.dto';
import { CreateGroupDto } from '../dto/create-group.dto';
import { EditGroupDto } from '../dto/edit-group-request.dto';
import { EditGroupResonseDto } from '../dto/edit-group-response.dto';
import { EditRecipientDto } from '../dto/edit-recipient.dto';
import { FirstEventResponseDto } from '../dto/first-event-response.dto';
import { RemoveRecipientDto } from '../dto/remove-recipient.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { Event, EventDocument } from '../models/event.model';
import { GroupRecipientInviteDocument } from '../models/group-invite.model';
import { GroupRecipientInvite } from '../models/group-invite.model';
import {
  GroupOutfitBuyer,
  GroupOutfitBuyerDocument,
} from '../models/group-outfit-buyers';
import { Group, GroupDocument } from '../models/group.model';
import { MeasurementStatus } from '../models/measurement-status.enum';
import { PaymentMethod } from '../models/payment-method.enum';
import { PaymentStatus } from '../models/payment-status.enum';

@Injectable()
export class GroupsService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
    @InjectModel(OutfitBuyer.name)
    private OutfitBuyerModel: Model<OutfitBuyerDocument>,
    @InjectModel(Event.name)
    private EventModel: Model<EventDocument>,
    @InjectModel(GroupOutfitBuyer.name)
    private GroupOutfitBuyerModel: Model<GroupOutfitBuyerDocument>,
    @InjectModel(Group.name)
    private GroupModel: Model<GroupDocument>,
    private messagingService: MessagingService,
    private mailingService: MailingService,
    @InjectModel(GroupRecipientInvite.name)
    private GroupRecipientInviteModel: Model<GroupRecipientInviteDocument>,
    private imageUploaderService: ImageUploaderService,
  ) {}

  async createEventAndSignup(
    createEventAndSignupDto: CreateEventAndSignupDto,
    file: Express.Multer.File,
  ): Promise<FirstEventResponseDto> {
    this.validateEventDate(createEventAndSignupDto.date);
    const outfitBuyerPayload: OutfitBuyerSignupResponseDto =
      await this.authService.signupAsOutfitBuyer({
        ...createEventAndSignupDto.outfitBuyer,
      });

    const createEventDto: CreateEventDto = {
      name: createEventAndSignupDto.name,
      date: createEventAndSignupDto.date,
      type: createEventAndSignupDto.type,
      role: createEventAndSignupDto.role,
      gender: createEventAndSignupDto.gender,
    };

    const eventGroup = await this.createEvent(
      createEventDto,
      outfitBuyerPayload.outfitBuyer.userAccount,
      file,
      true,
    );

    this.mailingService.sendOutfitBuyerFirstEventEmail(
      outfitBuyerPayload.outfitBuyer.userAccount,
      eventGroup.event,
    );

    return {
      ...outfitBuyerPayload,
      ...eventGroup,
    };
  }

  async EditGroup(editgroupDto: EditGroupDto): Promise<EditGroupResonseDto> {
    const updatedGroup = await this.GroupModel.findByIdAndUpdate(
      editgroupDto.id,
      {
        name: editgroupDto.name,
      },
      { new: true },
    ).exec();

    return {
      status: 'ok',
      message: 'group update successfully',
      data: updatedGroup,
    };
  }

  async createEvent(
    createEventDto: CreateEventDto,
    user: UserAccount,
    file: Express.Multer.File,
    signupAndCreateEvent: boolean,
  ): Promise<any> {
    this.validateEventDate(createEventDto.date);
    let imageMetadata: any;
    if (file) {
      imageMetadata = await this.imageUploaderService.uploadEventImage(file);
    }

    const createEventModel: any = new this.EventModel(createEventDto);
    createEventModel.link = this.generateUniqueEventLink(createEventModel.name);
    if (file) {
      createEventModel.images.push([
        imageMetadata.public_id,
        imageMetadata.secure_url,
      ]);
      createEventModel.imagesMetadata[imageMetadata.public_id] = imageMetadata;
    }

    const outfitBuyer: OutfitBuyer =
      await this.usersService.getOutfitBuyerProfile(user.id);
    createEventModel.creator = outfitBuyer.id;
    createEventModel.admins.push(outfitBuyer.id);
    const event = await createEventModel.save();

    const createGroupDto: CreateGroupDto = {
      eventId: event.id,
      gender: createEventDto.gender,
    };

    const group = await this.addGroup(user, createGroupDto);

    await this.notificationsService.createEvent(
      `${user.firstName} ${user.lastName}`,
      `${event.date.toString()}`,
      `${event.link}`,
      `${event.name}`,
      user.id,
      user.id,
    );
    if (signupAndCreateEvent) {
      await this.mailingService.sendCreateEventMail(user, event);
    }

    return {
      group,
      event,
    };
  }

  async addGroup(
    user: UserAccount,
    createGroupDto: CreateGroupDto,
  ): Promise<Group> {
    const outfitBuyer: OutfitBuyer =
      await this.usersService.getOutfitBuyerProfile(user.id);
    let createGroupModel: any = new this.GroupModel(createGroupDto);
    createGroupModel.admins.push(outfitBuyer.id);
    createGroupModel.members.push(outfitBuyer.id);
    createGroupModel.initiator = outfitBuyer.id;
    createGroupModel.event = createGroupDto.eventId;
    createGroupModel.gender = createGroupModel.gender;
    createGroupModel.name = `${user.firstName} ${user.lastName}`;
    createGroupModel = await createGroupModel.save();

    const createGroupOutfitBuyer: GroupOutfitBuyer = {
      group: createGroupModel,
      outfitBuyer: outfitBuyer.id,
      isAdmin: true,
      useInitiatorTailor: true,
      canChooseTailor: true,
      useInitiatorMeasurementToken: true,
      measurementStatus: MeasurementStatus.NotTaken,
      paymentMethod: PaymentMethod.None,
      paymentStatus: PaymentStatus.NotPaid,
      dateAdded: new Date(),
      dateJoined: new Date(),
    };
    const groupOutfitBuyerModel = new this.GroupOutfitBuyerModel(
      createGroupOutfitBuyer,
    );
    await groupOutfitBuyerModel.save();
    return createGroupModel;
  }

  async getOutfitBuyerGroups(user: UserAccount): Promise<any> {
    const outfitBuyer: OutfitBuyer =
      await this.usersService.getOutfitBuyerProfile(user);
    const outfitBuyerGroups: GroupOutfitBuyer[] =
      await this.GroupOutfitBuyerModel.find(
        { outfitBuyer: outfitBuyer.id },
        { group: 1 },
      ).exec();
    const groupIds: string[] = outfitBuyerGroups.map(
      (outfitBuyerGroup) => outfitBuyerGroup.group,
    ) as string[];

    const groups: Group[] = await this.GroupModel.find({
      _id: { $in: groupIds },
    })
      .populate('event')
      .populate({
        path: 'initiator',
        populate: {
          path: 'userAccount',
        },
      })
      .exec();
    outfitBuyer.userAccount = user;
    return {
      outfitBuyer,
      groups,
    };
  }

  async addKnownRecipientToGroup(
    outfitBuyerId: string,
    addRecipientDto: AddRecipientDto,
    user: UserAccount,
  ): Promise<void> {
    const recipientInGroup: boolean = await this.checkRecipientInGroup(
      outfitBuyerId,
      addRecipientDto.groupId,
    );
    if (
      recipientInGroup &&
      (addRecipientDto.email === user.email ||
        addRecipientDto.phoneNumber === user.phoneNumber)
    ) {
      throw new ConflictException(`You cannot add yourself to your group`);
    }
    if (recipientInGroup) {
      throw new ConflictException(
        `${addRecipientDto.firstName} with email ${addRecipientDto.email} is already in this group`,
      );
    }
  }

  async addRecipientToGroup(
    addRecipientDto: AddRecipientDto,
    user: UserAccount,
  ): Promise<GroupRecipientInvite> {
    const initiator: OutfitBuyer = await this.checkUserIsGroupInitiator(
      addRecipientDto.groupId,
      user.id,
    );
    const userExists: UserAccount = await this.validateInviteToExistingUser(
      addRecipientDto,
    );
    let recipientExists: OutfitBuyer;
    if (userExists) {
      recipientExists = await this.usersService.getOutfitBuyerProfile(
        userExists.id,
      );
    }

    if (recipientExists) {
      await this.addKnownRecipientToGroup(
        recipientExists.id,
        addRecipientDto,
        user,
      );
    }
    await this.checkInviteExists(addRecipientDto);

    const group: Group = await this.GroupModel.findById(addRecipientDto.groupId)
      .populate('event')
      .exec();

    const inviteCode: string = this.generateInviteCode();
    const groupInvite = new this.GroupRecipientInviteModel({
      code: inviteCode,
      groupId: addRecipientDto.groupId,
      eventUrl: group.event.link,
      invitationDate: new Date(),
      firstName: addRecipientDto.firstName,
      lastName: addRecipientDto.lastName,
      email: addRecipientDto.email,
      phoneNumber: addRecipientDto.phoneNumber,
      gender: group.gender,
      useInitiatorTailor: addRecipientDto.useInitiatorTailor,
      canChooseTailor: addRecipientDto.canChooseTailor,
      useInitiatorMeasurementToken:
        addRecipientDto.useInitiatorMeasurementToken,
      location: addRecipientDto.location,
    });
    const invite: GroupRecipientInvite = await groupInvite.save();

    if (addRecipientDto.smsInvite) {
      await this.messagingService.sendGroupRecipientInvitation(
        addRecipientDto,
        user.firstName,
        group.event.name,
        group.event.link,
        `${config.groupInviteUrl}?inviteCode=${inviteCode}`,
      );
    }

    if (addRecipientDto.emailInvite) {
      await this.mailingService.sendGroupRecipientInvitation(
        addRecipientDto,
        user.firstName,
        group.event.name,
        group.event.link,
        `${config.groupInviteUrl}?inviteCode=${inviteCode}`,
      );
    }
    await this.notificationsService.addGroupRecipient(
      `${addRecipientDto.firstName} ${addRecipientDto.lastName}`,
      user.id,
      user.id,
      addRecipientDto.canChooseTailor,
    );
    return invite;
  }
  async validateInviteToExistingUser(
    addRecipientDto: AddRecipientDto,
  ): Promise<UserAccount> {
    const emailExists = await this.usersService.getUserAccountByEmail(
      addRecipientDto.email,
    );
    const phoneNumberExists =
      await this.usersService.getUserAccountByPhoneNumber(
        addRecipientDto.phoneNumber,
      );
    if (!emailExists && !phoneNumberExists) {
      return null;
    } else if (
      (!emailExists && phoneNumberExists) ||
      (emailExists && !phoneNumberExists)
    ) {
      throw new BadRequestException(
        'Email and Phone Number entered are tied to existing accounts',
      );
    } else if (emailExists && phoneNumberExists) {
      if (emailExists.email !== phoneNumberExists.email) {
        throw new BadRequestException(
          'Email and Phone Number entered are tied to different accounts',
        );
      } else {
        return emailExists;
      }
    }
  }

  async getGroupRecipientInvitation(
    code: string,
  ): Promise<GroupRecipientInvite> {
    const groupInvite: any = await this.GroupRecipientInviteModel.findOne(
      { code },
      {
        groupId: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        phoneNumber: 1,
        gender: 1,
        code: 1,
        accepted: 1,
        useInitiatorTailor: 1,
        canChooseTailor: 1,
        useInitiatorMeasurementToken: 1,
        invitationDate: 1,
        location: 1,
        eventUrl: 1,
      },
    ).exec();
    if (!groupInvite) {
      throw new BadRequestException(
        `Invite has been revoked or no longer exists`,
      );
    } else if (groupInvite.accepted) {
      throw new BadRequestException(`Invite has been accepted`);
    }
    const chceckUserAccount =
      await this.usersService.checkUserAccountEmailExists(groupInvite.email);
    const res = { ...groupInvite.toObject(), UserAccount: chceckUserAccount };
    return res;
  }

  async acceptGroupRecipientInvitation(
    acceptInviteDto: AcceptInviteRequestDto,
  ): Promise<AcceptInviteResponseDto> {
    const groupInvite: GroupRecipientInvite =
      await this.getGroupRecipientInvitation(acceptInviteDto.code);
    const outfitBuyerPayload: OutfitBuyerSignupResponseDto =
      await this.authService.signupAsOutfitBuyer({
        firstName: acceptInviteDto.firstName,
        lastName: acceptInviteDto.lastName,
        email: groupInvite.email,
        phoneNumber: groupInvite.phoneNumber,
        password: acceptInviteDto.password,
        confirmPassword: acceptInviteDto.confirmPassword,
        gender: groupInvite.gender,
        location: acceptInviteDto.location,
      });
    let groupOutfitBuyer: any = {
      group: groupInvite.groupId,
      outfitBuyer: outfitBuyerPayload.outfitBuyer,
      isAdmin: false,
      useInitiatorTailor: groupInvite.useInitiatorTailor,
      canChooseTailor: groupInvite.canChooseTailor,
      useInitiatorMeasurementToken: groupInvite.useInitiatorMeasurementToken,
      dateAdded: groupInvite.invitationDate,
      dateJoined: new Date(),
      paymentStatus: PaymentStatus.NotPaid,
      measurementStatus: MeasurementStatus.NotTaken,
      paymentMethod: PaymentMethod.None,
    };
    groupOutfitBuyer = new this.GroupOutfitBuyerModel(groupOutfitBuyer);
    await groupOutfitBuyer.save();
    await this.GroupRecipientInviteModel.findOneAndUpdate(
      { code: acceptInviteDto.code },
      {
        accepted: true,
      },
      { new: true },
    ).exec();

    const { firstName, lastName, id } =
      outfitBuyerPayload.outfitBuyer.userAccount;
    const group: Group = await this.GroupModel.findById(groupInvite.groupId)
      .populate({
        path: 'initiator',
        populate: {
          path: 'userAccount',
        },
      })
      .populate('event')
      .exec();
    await this.GroupModel.findByIdAndUpdate(group.id, {
      $push: {
        members: outfitBuyerPayload.outfitBuyer.id,
      },
    }).exec();
    const initiatorFirstName = group.initiator.userAccount.firstName;
    const initiatorLastName = group.initiator.userAccount.lastName;
    if (groupInvite.useInitiatorTailor) {
      await this.notificationsService.acceptGroupInviteToUseInitiatorTailor(
        `${firstName} ${lastName}`,
        `${initiatorFirstName} ${initiatorLastName}`,
        id,
        group.initiator.userAccount.id,
        group.event.name,
      );
    } else {
      await this.notificationsService.acceptGroupInvite(
        `${firstName} ${lastName}`,
        id,
        group.initiator.userAccount.id,
      );
    }

    return {
      ...outfitBuyerPayload,
      groupOutfitBuyer,
    };
  }

  async removeRecipientFromGroup(
    removeRecipientDto: RemoveRecipientDto,
    user: UserAccount,
  ): Promise<boolean> {
    await this.checkUserIsGroupInitiator(removeRecipientDto.groupId, user.id);
    const { groupId, outfitBuyerId } = removeRecipientDto;
    const recipientExists: boolean = await this.checkRecipientInGroup(
      outfitBuyerId,
      groupId,
    );
    if (!recipientExists) {
      throw new BadRequestException('user not part of group');
    }
    await this.GroupOutfitBuyerModel.findOneAndDelete({
      group: groupId,
      outfitBuyer: outfitBuyerId,
    }).exec();
    const outfitBuyer: OutfitBuyer = await this.OutfitBuyerModel.findById(
      outfitBuyerId,
    )
      .populate('userAccount')
      .exec();

    await this.notificationsService.deleteGroupRecipient(
      `${outfitBuyer.userAccount.firstName} ${outfitBuyer.userAccount.lastName}`,
      `${user.firstName} ${user.lastName}`,
      user.id,
      outfitBuyer.userAccount.id,
    );
    return true;
  }

  async removeGroupRecipientInvite(
    code: string,
    user: UserAccount,
  ): Promise<boolean> {
    const invite: GroupRecipientInvite = await this.getGroupRecipientInvitation(
      code,
    );
    await this.checkUserIsGroupInitiator(invite.groupId, user.id);
    await this.GroupRecipientInviteModel.findOneAndDelete({ code }).exec();
    // notifications?
    return true;
  }

  async checkRecipientInGroup(
    outfitBuyerId: string,
    groupId: string,
  ): Promise<boolean> {
    const recipientExists: GroupOutfitBuyer =
      await this.GroupOutfitBuyerModel.findOne({
        group: groupId,
        outfitBuyer: outfitBuyerId,
      }).exec();
    if (recipientExists) return true;
    return false;
  }

  private async checkUserIsGroupInitiator(
    groupId: string,
    userId: string,
  ): Promise<OutfitBuyer> {
    const group: Group = await this.GroupModel.findById(groupId).exec();
    const outfitBuyer: OutfitBuyer =
      await this.usersService.getOutfitBuyerProfile(userId);
    if (group.initiator.toString() !== outfitBuyer.id) {
      throw new ForbiddenException('You are not the admin for this group');
    }
    return outfitBuyer;
  }

  async checkInviteExists(addRecipientDto: AddRecipientDto): Promise<void> {
    const queryObject: any = {};
    if (addRecipientDto.email) {
      queryObject.email = addRecipientDto.email;
    }
    if (addRecipientDto.phoneNumber) {
      queryObject.phoneNumber = addRecipientDto.phoneNumber;
    }
    const inviteExists: GroupRecipientInvite[] =
      await this.GroupRecipientInviteModel.find({
        $and: [
          {
            $or: [queryObject],
          },
          { groupId: addRecipientDto.groupId },
        ],
      }).exec();

    if (inviteExists.length > 0) {
      throw new ConflictException(
        `An invite has already been sent to ${addRecipientDto.firstName} previously.`,
      );
    }
  }

  generateUniqueEventLink(eventName: string): string {
    const eventSlug = slug(eventName);
    const uid = randomBytes(6).toString('hex').slice(0, 6);
    return `${eventSlug}-${uid}`;
  }

  generateInviteCode(): string {
    return randomBytes(20).toString('hex').slice(0, 8);
  }

  async getGroupInvites(
    groupId: string,
    skip: number,
    limit: number,
    user: UserAccount,
  ): Promise<GroupRecipientInvite[]> {
    await this.checkUserIsGroupInitiator(groupId, user.id);
    return this.GroupRecipientInviteModel.find({
      groupId,
      accepted: false,
    })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async getGroupMembers(
    groupId: string,
    skip: number,
    limit: number,
    user: UserAccount,
  ): Promise<GroupOutfitBuyer[]> {
    await this.checkUserIsGroupMember(user, groupId);
    return this.GroupOutfitBuyerModel.find(
      { group: groupId },
      { createdAt: 0, updatedAt: 0 },
    )
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'outfitBuyer',
        populate: {
          path: 'userAccount',
        },
      })
      .exec();
  }

  async editGroupRecipientInvitation(
    editRecipientDto: EditRecipientDto,
    user: UserAccount,
  ): Promise<GroupRecipientInvite> {
    await this.checkUserIsGroupInitiator(editRecipientDto.groupId, user.id);
    const previousInvite: GroupRecipientInvite =
      await this.getGroupRecipientInvitation(editRecipientDto.code);
    const { code, ...addRecipientDto } = editRecipientDto;
    await this.GroupRecipientInviteModel.findByIdAndDelete(
      previousInvite.id,
    ).exec();
    const invite: GroupRecipientInvite = await this.addRecipientToGroup(
      addRecipientDto,
      user,
    );
    await this.notificationsService.editRecipientInvite(
      `${editRecipientDto.firstName} ${editRecipientDto.lastName}`,
      user.id,
      user.id,
    );
    return invite;
  }

  async joinGroup(code: string, user: UserAccount): Promise<Group> {
    const groupInvite: GroupRecipientInvite =
      await this.getGroupRecipientInvitation(code);

    const outfitBuyer: OutfitBuyer =
      await this.usersService.getOutfitBuyerProfile(user.id);
    if (user.email !== groupInvite.email) {
      throw new BadRequestException('Invalid Invite');
    }
    let groupOutfitBuyer: any = {
      group: groupInvite.groupId,
      outfitBuyer,
      isAdmin: false,
      useInitiatorTailor: groupInvite.useInitiatorTailor,
      canChooseTailor: groupInvite.canChooseTailor,
      useInitiatorMeasurementToken: groupInvite.useInitiatorMeasurementToken,
      dateAdded: groupInvite.invitationDate,
      dateJoined: new Date(),
      paymentStatus: PaymentStatus.NotPaid,
      measurementStatus: MeasurementStatus.NotTaken,
      paymentMethod: PaymentMethod.None,
    };
    groupOutfitBuyer = new this.GroupOutfitBuyerModel(groupOutfitBuyer);
    groupOutfitBuyer = await groupOutfitBuyer.save();
    await this.GroupRecipientInviteModel.findOneAndUpdate(
      { code },
      {
        accepted: true,
      },
      { new: true },
    ).exec();

    await this.GroupModel.findByIdAndUpdate(groupInvite.groupId, {
      $push: {
        members: outfitBuyer.id,
      },
    }).exec();

    const { firstName, lastName, id } = user;
    const group: Group = await this.GroupModel.findById(groupInvite.groupId)
      .populate({
        path: 'initiator',
        populate: {
          path: 'userAccount',
        },
      })
      .populate('event')
      .exec();
    const initiatorFirstName = group.initiator.userAccount.firstName;
    const initiatorLastName = group.initiator.userAccount.lastName;
    if (groupInvite.useInitiatorTailor) {
      await this.notificationsService.acceptGroupInviteToUseInitiatorTailor(
        `${firstName} ${lastName}`,
        `${initiatorFirstName} ${initiatorLastName}`,
        id,
        group.initiator.userAccount.id,
        group.event.name,
      );
    } else {
      await this.notificationsService.acceptGroupInvite(
        `${firstName} ${lastName}`,
        id,
        group.initiator.userAccount.id,
      );
    }

    return group;
  }

  async getEventDetails(eventUrl: string): Promise<any> {
    const event: Event = await this.EventModel.findOne({
      link: eventUrl,
    })
      .populate({
        path: 'creator',
        populate: {
          path: 'userAccount',
        },
      })
      .exec();
    const groups: Group[] = await this.GroupModel.find({ event }).exec();

    const result: any = {};
    result.event = event;
    result.groups = [];

    // for (let i = 0; i < groups.length; i++) {
    for (const group of groups) {
      const groupId: string = group.id; // groups[i].id;
      const groupMembers: any = await this.GroupOutfitBuyerModel.find(
        { group: groupId },
        { outfitBuyer: 1, isAdmin: 1 },
      )
        .populate({
          path: 'outfitBuyer',
          populate: {
            path: 'userAccount',
          },
        })
        .exec();
      const initiator = groupMembers.filter(
        (groupMember) => groupMember.isAdmin === true,
      )[0].outfitBuyer.userAccount;
      const name = `${initiator.firstName} ${initiator.lastName}`;
      groupMembers.map((groupMember) => groupMember.outfitBuyer);
      result.groups.push({
        group, // groups[i],
        members: groupMembers,
        name,
      });
    }

    return result;
  }

  validateEventDate(eventDate: Date): void {
    const earliestDate: Date = moment()
      .add(config.minEventStartDate, 'days')
      .toDate();
    if (moment(eventDate).isBefore(earliestDate)) {
      throw new BadRequestException(
        'Please pick a date at least 2 weeks from now',
      );
    }
  }

  validateEditEventDate(eventDate: Date): void {
    const earliestDate: Date = moment()
      .add(config.minEventStartDate, 'days')
      .toDate();
    if (moment(eventDate).isBefore(earliestDate)) {
      throw new BadRequestException(
        'Please pick a date at least 2 weeks from now',
      );
    }
  }

  async getOutfitBuyerEventsAndGroups(
    user: any,
  ): Promise<OutfitBuyerDetailsDto> {
    const outfitBuyer: OutfitBuyer =
      await this.usersService.getOutfitBuyerProfile(user);
    const outfitBuyerGroups: GroupOutfitBuyer[] =
      await this.GroupOutfitBuyerModel.find(
        { outfitBuyer: outfitBuyer.id },
        { group: 1 },
      ).exec();
    const groupIds: string[] = outfitBuyerGroups.map(
      (outfitBuyerGroup) => outfitBuyerGroup.group,
    ) as string[];

    const groups: Group[] = await this.GroupModel.find({
      _id: { $in: groupIds },
    })
      .populate({
        path: 'initiator',
        populate: {
          path: 'userAccount',
        },
      })
      .populate({
        path: 'event',
        populate: {
          path: 'creator',
          populate: {
            path: 'userAccount',
          },
        },
      })
      .exec();
    const result = [];
    const seen = {};
    for (const group of groups) {
      if (group.event.id in seen) {
        const index = seen[group.event.id];
        result[index].groups.push(group);
      } else {
        const newObj: any = {};
        newObj.event = group.event;
        newObj.groups = [group];
        result.push(newObj);
        seen[group.event.id] = result.length - 1;
      }
    }

    outfitBuyer.userAccount = user;
    return {
      outfitBuyer,
      eventAndGroups: result,
    };
  }

  async sendBatchInvites(
    emails: string,
    user: UserAccount,
    groupId: string,
  ): Promise<any> {
    const emailArray: string[] = emails.trim().split(',');
    const registeredMembers: string[] = [];
    const newMembers: string[] = [];

    // registeredMembers = emailArray.filter((email) => {
    //   return this.usersService.checkUserAccountEmailExists(email);
    // })
    for (let email of emailArray) {
      try {
        email = email.trim();
        const userAccount: UserAccount =
          await this.usersService.getUserAccountByEmail(email);
        if (userAccount) {
          registeredMembers.push(email);
          const addDto: AddRecipientDto = {
            groupId,
            firstName: userAccount.firstName,
            lastName: userAccount.lastName,
            email: userAccount.email,
            phoneNumber: userAccount.phoneNumber,
            location: userAccount.location,
            smsInvite: true,
            emailInvite: true,
            canChooseTailor: true,
            useInitiatorMeasurementToken: true,
            useInitiatorTailor: true,
          };
          await this.addRecipientToGroup(addDto, user);
        } else {
          newMembers.push(email);
          const addDto: AddRecipientDto = {
            groupId,
            firstName: '',
            lastName: '',
            email,
            location: '',
            smsInvite: false,
            emailInvite: true,
            canChooseTailor: true,
            useInitiatorMeasurementToken: true,
            useInitiatorTailor: true,
          };
          await this.addRecipientToGroup(addDto, user);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  async updateEvent(
    updateEventDto: UpdateEventDto,
    user: UserAccount,
    file: Express.Multer.File,
  ): Promise<Event> {
    console.log(file);
    await this.checkUserIsEventCreator(user, updateEventDto.id);
    const userEvent = await this.EventModel.findById(updateEventDto.id).exec();

    const SelectedEventDate = new Date(updateEventDto.date);

    if (SelectedEventDate < new Date(Date.now() + 12096e5)) {
      throw new BadRequestException(
        `Date must be greater than 2 weeks from today`,
      );
    }

    const deletedImages: Set<string> = new Set(updateEventDto.deletedImages);
    const result = await this.EventModel.findById(updateEventDto.id, {
      images: 1,
      imagesMetadata: 1,
    }).exec();
    let images = result.images;
    const imagesMetadata = result.imagesMetadata;
    images = images.filter((image) => !deletedImages.has(image[0]));

    for (const image of deletedImages) {
      if (image in imagesMetadata) {
        delete imagesMetadata[image];
      }
      await this.imageUploaderService.deleteImage(image);
    }
    if (file) {
      const newImageMetadata: any =
        await this.imageUploaderService.uploadEventImage(file);
      images.push([newImageMetadata.public_id, newImageMetadata.secure_url]);
      imagesMetadata[newImageMetadata.public_id] = newImageMetadata;
    }

    const updateObj: Partial<Event> = {};

    if (updateEventDto.name) {
      updateObj.name = updateEventDto.name;
    }
    if (updateEventDto.type) {
      updateObj.type = updateEventDto.type;
    }
    if (updateEventDto.role) {
      updateObj.role = updateEventDto.role;
    }
    if (updateEventDto.date) {
      updateObj.date = updateEventDto.date;
    }
    updateObj.images = images;
    updateObj.imagesMetadata = imagesMetadata;

    return this.EventModel.findByIdAndUpdate(updateEventDto.id, updateObj, {
      new: true,
    }).exec();
  }

  async checkUserIsEventCreator(
    user: UserAccount,
    eventId: string,
  ): Promise<OutfitBuyer> {
    const event: Event = await this.EventModel.findById(eventId).exec();
    const outfitBuyer: OutfitBuyer =
      await this.usersService.getOutfitBuyerProfile(user.id);
    if (event.creator.toString() !== outfitBuyer.id) {
      throw new ForbiddenException('You are not the creator of this event');
    }
    return outfitBuyer;
  }

  async checkUserIsGroupMember(
    user: UserAccount,
    groupId: string,
  ): Promise<void> {
    const group: Group = await this.GroupModel.findById(groupId).exec();
    const outfitBuyer: OutfitBuyer =
      await this.usersService.getOutfitBuyerProfile(user.id);
    const groupOutfitBuyer: GroupOutfitBuyer =
      await this.GroupOutfitBuyerModel.findOne({
        group: group.id,
        outfitBuyer: outfitBuyer.id,
      }).exec();
    if (!groupOutfitBuyer) {
      throw new ForbiddenException('You are not a member of this group');
    }
  }

  getCurrentDate(): Date {
    const todaysDate: Date = moment().toDate();
    return todaysDate;
  }
}

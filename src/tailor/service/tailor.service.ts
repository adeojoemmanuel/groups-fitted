import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { string } from 'joi';
import { Model } from 'mongoose';
import { use } from 'passport';
import {
  MeasurementRequest,
  MeasurementRequestDocument,
} from 'src/measurements/models/measurement-request.model';
import {
  Measurement,
  MeasurementDocument,
} from 'src/measurements/models/measurement.model';
import {
  TailorInvite,
  TailorInviteDocument,
} from 'src/measurements/models/tailor-invite.model';
import { NotificationsService } from 'src/notifications/services/notifications.service';
import {
  OutfitBuyer,
  OutfitBuyerDocument,
} from 'src/users/models/outfit-buyer.schema';
import {
  UserAccount,
  UserAccountDocument,
} from 'src/users/models/user-account.schema';
import { UsersService } from 'src/users/services/users.service';
import { ImageUploaderService } from 'src/utils/imageUploader/imageUploader.service';
import { MailingService } from 'src/utils/mailing/mailing.service';
import { MessagingService } from 'src/utils/messaging/messaging.service';
import { config } from '../../config/';
import { AddTailorResponseDto } from '../dto/add-tailor-response.dto';
import { AddTailorDto } from '../dto/add-tailor.dto';
import { DownloadMeasurementResponseDto } from '../dto/download-measurement-response.dto';
import { DownloadMeasurementDto } from '../dto/download-measurment.dto';
import { FetchInviteeResponseDto } from '../dto/fetch-invitee-response.dto';
import { FetchInviteeDto } from '../dto/fetch-invitee.dto';
import { MeasurementFavouriteResponseDto } from '../dto/measurement-favourite-response.dto';
import { MeasurementFavouriteDto } from '../dto/measurement-favourite.dto';
import { TailorMeasurementResponseDto } from '../dto/tailor-measurements-response.dto';
import { TailorProfileDto } from '../dto/tailor.profile.dto';

@Injectable()
export class TailorService {
  constructor(
    @InjectModel(Measurement.name)
    private MeasurementModel: Model<MeasurementDocument>,
    @InjectModel(MeasurementRequest.name)
    private MeasurementRequestModel: Model<MeasurementRequestDocument>,
    @InjectModel(UserAccount.name)
    private UserAccountModel: Model<UserAccountDocument>,
    @InjectModel(OutfitBuyer.name)
    private OutfitBuyerModel: Model<OutfitBuyerDocument>,
    @InjectModel(TailorInvite.name)
    private TailorInviteModel: Model<TailorInviteDocument>,
    private messagingService: MessagingService,
    private notificationsService: NotificationsService,
    private imageUploaderService: ImageUploaderService,
    private mailingService: MailingService,
    private userService: UsersService,
  ) {}
  async addTailor(
    addTailorDto: AddTailorDto,
    user: UserAccount,
  ): Promise<AddTailorResponseDto> {
    if (!user.measurement) {
      throw new BadRequestException(
        `you must take your measurements, before sending to a tailor`,
      );
    } else {
      await this.userService.checkEmailAndPhone(
        addTailorDto.email,
        addTailorDto.phoneNumber,
      );
      // const measurementConfirmed = await this.MeasurementModel.findById(
      //   user.measurement
      // ).exec();

      // if (!measurementConfirmed.measurementData) {
      //   throw new BadRequestException(
      //     `you must confirm your measurements, before sending to a tailor`,
      //   );
      // }
      let inviteCode;

      const outfitBuyer: OutfitBuyer = await this.OutfitBuyerModel.findOne({
        userAccount: user,
      }).exec();
      const checkTailorInvite = await this.TailorInviteModel.findOne({
        email: addTailorDto.email,
      }).exec();

      const measurementRequest = new this.MeasurementRequestModel({
        outfitBuyer: outfitBuyer.userAccount,
        measurement: user.measurement,
        tailorEmail: addTailorDto.email,
        accepted: false,
        membersAssign: addTailorDto.membersAssign,
        groupTailor: addTailorDto.groupTailor,
        useTailor: addTailorDto.useTailor,
        event: addTailorDto.eventId,
        group: addTailorDto.groupId,
      });
      await measurementRequest.save();

      if (checkTailorInvite) {
        inviteCode = checkTailorInvite.code;
        await this.TailorInviteModel.update(
          { _id: checkTailorInvite._id },
          { $push: { measurementRequests: addTailorDto.measurementId } },
        ).exec();
      } else {
        inviteCode = this.generateInviteCode();
        let tailorInvite: any;
        tailorInvite = new this.TailorInviteModel({
          code: inviteCode,
          firstName: addTailorDto.firstName,
          lastName: addTailorDto.lastName,
          email: addTailorDto.email,
          gender: addTailorDto.gender,
          accepted: false,
          phoneNumber: addTailorDto.phoneNumber,
          measurementRequests: [addTailorDto.measurementId],
        });
        await tailorInvite.save();
      }
      // call email, sms, and in-app notifs
      if (addTailorDto.smsInvite) {
        await this.messagingService.sendTailorInvite(
          addTailorDto,
          user.firstName,
          `${config.sendGrid.TAILOR_LINK}/tailorinvites/${inviteCode}/${outfitBuyer.userAccount}`,
        );
      }

      await this.notificationsService.sendMeasurementTailor(
        `${addTailorDto.firstName} ${addTailorDto.lastName}`,
        user.id,
        user.id,
      );

      this.mailingService.sendTailorMeasurement(
        addTailorDto,
        user,
        `${config.sendGrid.TAILOR_LINK}/tailorinvites/${inviteCode}/${outfitBuyer.userAccount}`,
      );
    }

    return {
      status: 'ok',
      message: `your measurements have been sent to ${addTailorDto.firstName} ${addTailorDto.lastName}`,
      tailor: addTailorDto,
    };
  }
  async fetchInvitee(
    fetchInviteeDto: FetchInviteeDto,
  ): Promise<FetchInviteeResponseDto> {
    const tailorDetails = await this.TailorInviteModel.findOne({
      code: fetchInviteeDto.inviteCode,
    })
      .lean()
      .exec();

    const checkIfAccepted: UserAccount = await this.UserAccountModel.findOne({
      email: tailorDetails.email,
    }).exec();

    if (checkIfAccepted) {
      tailorDetails.accepted = checkIfAccepted.role.includes('tailor')
        ? true
        : false;
    }
    const user: UserAccount = await this.UserAccountModel.findById(
      fetchInviteeDto.id,
    ).exec();

    return {
      status: 'ok',
      user,
      tailor: {
        ...tailorDetails,
        canEdit: checkIfAccepted ? false : true,
      },
    };
  }
  async getTailorMeasurements(
    user: UserAccount,
  ): Promise<TailorMeasurementResponseDto> {
    const measurementRequested = [];

    //  fetch all invites to tailor
    const measurementRequest = await this.TailorInviteModel.findOne({
      email: user.email,
    }).exec();

    // for loop to get measurements request
    for (const measurement of measurementRequest.measurementRequests) {
      const meaurementsRequests = await this.MeasurementRequestModel.findById(
        measurement,
      ).exec();
      const outfitBuyer = await this.UserAccountModel.findById(
        meaurementsRequests.outfitBuyer,
      ).exec();
      const meaurements = await this.MeasurementModel.findById(
        meaurementsRequests.measurement,
      ).exec();
      const measurementData = {
        user: outfitBuyer,
        measurements: meaurements,
      };
      if (meaurements.measurementData) {
        measurementRequested.push(measurementData);
      }
    }
    return {
      status: 'ok',
      measurements: measurementRequested,
    };
  }
  async tailorProfile(user: UserAccount): Promise<TailorProfileDto> {
    return {
      status: 'ok',
      user,
    };
  }
  async favouriteMeasurement(
    measurementFavouriteDto: MeasurementFavouriteDto,
    user: UserAccount,
  ): Promise<MeasurementFavouriteResponseDto> {
    const measurement = await this.MeasurementModel.findById(
      measurementFavouriteDto.id,
    ).exec();
    if (!measurement) {
      throw new BadRequestException(`User ID does not exist`);
    }
    await this.MeasurementModel.findByIdAndUpdate(measurementFavouriteDto.id, {
      favourite: !measurement.favourite,
    }).exec();
    measurement.favourite = !measurement.favourite;
    return {
      status: 'ok',
      measurement,
    };
  }
  async downloadMeasurements(
    downloadMeasurementDto: DownloadMeasurementDto,
  ): Promise<DownloadMeasurementResponseDto> {
    const measurement = await this.MeasurementModel.findById(
      downloadMeasurementDto.id,
    ).exec();
    if (!measurement) {
      throw new BadRequestException(`User ID does not exist`);
    }

    if (!measurement.measurementData) {
      throw new BadRequestException(
        `measurement has to confirm measurements to download`,
      );
    }
    await this.messagingService.sendMeasurementToTailor(
      downloadMeasurementDto.phoneNumber,
      measurement.measurementData,
    );

    return {
      status: 'ok',
      message: 'sms sent',
    };
  }
  generateInviteCode(): string {
    return randomBytes(20).toString('hex').slice(0, 8);
  }
}

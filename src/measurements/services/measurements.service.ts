import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { validateOrReject } from 'class-validator';
import { randomBytes, randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { EditGroupResonseDto } from 'src/groups/dto/edit-group-response.dto';
import { NotificationsService } from 'src/notifications/services/notifications.service';
import { ImageUploaderService } from 'src/utils/imageUploader/imageUploader.service';
import { MessagingService } from 'src/utils/messaging/messaging.service';
import { add } from 'winston';
import { config } from '../../config';
import { AddTailorDto } from '../../tailor/dto/add-tailor.dto';
import {
  OutfitBuyer,
  OutfitBuyerDocument,
} from '../../users/models/outfit-buyer.schema';
import {
  UserAccount,
  UserAccountDocument,
} from '../../users/models/user-account.schema';
import { LoggerService } from '../../utils/logger/logger.service';
import { CloneMeasurementDto } from '../dto/clone-measurement.dto';
import { ConfirmAutoSizeDto } from '../dto/confirm-autosize-measurement.dto';
import { AutoSizeDto } from '../dto/create-autosize-measurement.dto';
import { FemaleCMAutoSizeDto } from '../dto/create-female-autosize-cm-measurement.dto';
import { FemaleAutoSizeDto } from '../dto/create-female-autosize-measurement.dto';
import { MaleCMAutoSizeDto } from '../dto/create-male-autosize-cm-measurement.dto';
import { MaleAutoSizeDto } from '../dto/create-male-autosize-measurement.dto';
import { CreateManualMeasurementDto } from '../dto/create-manual-measurement.dto';
import { CreateMeasurementRequestDto } from '../dto/create-measurement-request.dto';
import { EditMeasurementDto } from '../dto/edit-measurement.dto';
import { SkipAutoSizeMeasurementDto } from '../dto/skip-auto-measurement.dto';
import { MeasurementMethod } from '../models/measurement-method.enum';
import {
  MeasurementRequest,
  MeasurementRequestDocument,
} from '../models/measurement-request.model';
import { Measurement, MeasurementDocument } from '../models/measurement.model';
import {
  MeasurementVersions,
  MeasurementVersionsDocument,
} from '../models/measurements-versions.model';
import {
  TailorInvite,
  TailorInviteDocument,
} from '../models/tailor-invite.model';
import { allowedPropertiesList } from './allowedProperties';
import { friendlyNameMap } from './boldMetricsObjectMapper';
@Injectable()
export class MeasurementsService {
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
    @InjectModel(MeasurementVersions.name)
    private MeasurementVersion: Model<MeasurementVersionsDocument>,
    private messagingService: MessagingService,
    private notificationsService: NotificationsService,
    private imageUploaderService: ImageUploaderService,
    private logger: LoggerService,
  ) {}

  createMeasurementRequest(
    createMeasurementRequestDto: CreateMeasurementRequestDto,
    user: UserAccount,
  ): any {
    throw new Error('Method not implemented.');
  }

  async createManualMeasurement(
    manualMeasurementDto: CreateManualMeasurementDto,
    user: UserAccount,
    file: Express.Multer.File,
  ): Promise<any> {
    if (user.gender === 'male') {
      manualMeasurementDto.gender = 'm';
    } else {
      manualMeasurementDto.gender = 'w';
    }
    // await this.validateAutoSizeRequest(manualMeasurementDto);
    // this.convertUnitToInchesAndPounds(manualMeasurementDto);

    let fileUrl: string;
    if (file) {
      fileUrl = (
        await this.imageUploaderService.uploadMeasurementImage(file, user.id)
      ).secure_url;
    }

    const measurement = {
      method: MeasurementMethod.Manual,
      manualMeasurementData: manualMeasurementDto,
      measurementData: manualMeasurementDto,
      dateTaken: new Date(),
    };

    let measurementModel = new this.MeasurementModel(measurement);
    measurementModel = await measurementModel.save();
    await this.UserAccountModel.findByIdAndUpdate(user.id, {
      measurement: measurementModel.id,
    }).exec();

    let updatedMeasurements;
    const UsersMeasurements = {
      imageUrl: fileUrl,
      group: user.id,
      method: measurement.method,
      name: null,
      neck: manualMeasurementDto.neck,
      wrist: manualMeasurementDto.wrist,
      sleeveLength: manualMeasurementDto.sleeveLength,
      underArm: manualMeasurementDto.underArm,
      chest: manualMeasurementDto.chest,
      shortSleeve: manualMeasurementDto.shortSleeve,
      threeQuarterSleeve: manualMeasurementDto.threeQuarterSleeve,
      shoulder: manualMeasurementDto.shoulder,
      roundElbow: manualMeasurementDto.roundElbow,
      foreArm: manualMeasurementDto.foreArm,
      tommyCircumferenceTop: manualMeasurementDto.tommyCircumferenceTop,
      ankle: manualMeasurementDto.ankle,
      thighs: manualMeasurementDto.thighs,
      crotchLength: manualMeasurementDto.crotchLength,
      roundKnee: manualMeasurementDto.roundKnee,
      trouserWaist: manualMeasurementDto.trouserWaist,
      trouserInseam: manualMeasurementDto.trouserInseam,
      trouserHip: manualMeasurementDto.trouserHip,
      trouserLength: manualMeasurementDto.trouserLength,
      shoeSize: manualMeasurementDto.shoeSize,
      measurementId: randomBytes(20).toString('hex'),
      deleted: false,
      origin: null,
      version: 1,
      date: new Date(),
    };
    const checkMeasurementsVersion: any = await this.MeasurementVersion.findOne(
      {
        outfitBuyer: user.id,
      },
    ).exec();

    if (checkMeasurementsVersion) {
      UsersMeasurements.version =
        checkMeasurementsVersion.measurements[
          checkMeasurementsVersion.measurements.length - 1
        ].version + 1;
      updatedMeasurements = await this.MeasurementVersion.findByIdAndUpdate(
        checkMeasurementsVersion.id,
        {
          $push: {
            measurements: UsersMeasurements,
          },
        },
        { new: true },
      ).exec();
    } else {
      let newMeasurementsVersions: any;
      newMeasurementsVersions = new this.MeasurementVersion({
        outfitBuyer: user.id,
        measurements: UsersMeasurements,
      });
      updatedMeasurements = await newMeasurementsVersions.save();
    }

    return {
      status: 'ok',
      measurements: updatedMeasurements,
    };
  }

  async EditMeasurement(
    editMeasurementDto: EditMeasurementDto,
  ): Promise<EditGroupResonseDto> {
    const updatedMeasurement = await this.MeasurementVersion.updateOne(
      {
        'measurements.measurementId': editMeasurementDto.id,
      },
      {
        $set: {
          'measurements.$.name': editMeasurementDto.name,
        },
      },
      { new: true },
    ).exec();
    return {
      status: 'ok',
      message: 'measurement updated successfully',
      data: updatedMeasurement,
    };
  }

  async createAutoSizeMeasurement(
    autoSizeDto: AutoSizeDto,
    user: UserAccount,
  ): Promise<object> {
    const autoSizeDtoClone = { ...autoSizeDto };
    if (user.gender === 'male') {
      autoSizeDto.gender = 'm';
    } else {
      autoSizeDto.gender = 'w';
    }
    await this.validateAutoSizeRequest(autoSizeDto);
    this.convertUnitToInchesAndPounds(autoSizeDto);
    const requestString: string = this.buildRequestString(autoSizeDto);

    let resp;
    try {
      resp = (await axios.get(requestString)).data;
      // resp = this.getMockedResponse();
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        'Error with getting measurements, please contact qa@fitted.ng',
      );
    }

    const response: any = {
      isOutlier: false,
      outlierMessage: '',
      originalInput: autoSizeDtoClone,
      dimensions: {},
    };
    if (resp.code === 400) {
      return resp.message;
    }
    if (resp.outlier) {
      resp.isOutlier = true;
      resp.outlierMessage = this.prettyFormatOutlierMessage(
        resp.outlier_messages,
      );
    }

    const measurement = {
      method: MeasurementMethod.AutoSize,
      autoSizeMeasurementData: resp,
      dateTaken: new Date(),
      skipAutosizeData: autoSizeDto,
    };

    let measurementModel = new this.MeasurementModel(measurement);
    measurementModel = await measurementModel.save();
    await this.UserAccountModel.findByIdAndUpdate(user.id, {
      measurement: measurementModel.id,
    }).exec();
    response.dimensions = this.mapBoldMetricsMeasurementResponse(
      resp.dimensions,
    );
    return response;
  }

  convertUnitToInchesAndPounds(autoSizeDto: AutoSizeDto): void {
    autoSizeDto.weight *= 2.20462;
    autoSizeDto.height *= 0.393701;
    if (autoSizeDto.measurementUnit === 'cm') {
      for (const key in autoSizeDto) {
        if (key in friendlyNameMap) {
          autoSizeDto[key] *= 0.393701;
        }
      }
    }
  }

  prettyFormatOutlierMessage(outlier_messages: any): any {
    const messages: string[] = [
      'Hello, there are some off measurements in what you filled.',
      'Take a look at them below',
    ];
    for (const specific of outlier_messages.specifics) {
      // let friendlyFieldName: string = friendlyNameMap[specific.field];
      const words: string[] = specific.message.split(' ');
      for (let i = 0; i < words.length; i++) {
        if (words[i] in friendlyNameMap) {
          words[i] = friendlyNameMap[words[i]];
        }
      }
      messages.push(words.join(' '));
      // specific.message = specific.message.replace(specific.field, friendlyFieldName);
    }
    console.log(messages.join('\n'));
    return messages.join('\n');
  }

  buildRequestString(autoSizeDto: AutoSizeDto): string {
    const allowedProperties = new Set(allowedPropertiesList);
    let baseString: string = `https://api.boldmetrics.io/virtualtailor/get?client_id=${config.boldMetrics.clientId}&user_key=${config.boldMetrics.userKey}`;
    for (const key in autoSizeDto) {
      if (allowedProperties.has(key)) {
        baseString += `&${key}=${autoSizeDto[key]}`;
      }
    }
    return baseString;
  }

  async validateAutoSizeRequest(autoSizeDto: AutoSizeDto): Promise<void> {
    let validatedAutoSizeDto;
    if (autoSizeDto.gender === 'm' && autoSizeDto.measurementUnit === 'in') {
      validatedAutoSizeDto = new MaleAutoSizeDto(autoSizeDto);
    } else if (
      autoSizeDto.gender === 'm' &&
      autoSizeDto.measurementUnit === 'cm'
    ) {
      validatedAutoSizeDto = new MaleCMAutoSizeDto(autoSizeDto);
    } else if (
      autoSizeDto.gender === 'w' &&
      autoSizeDto.measurementUnit === 'in'
    ) {
      validatedAutoSizeDto = new FemaleAutoSizeDto(autoSizeDto);
    } else {
      validatedAutoSizeDto = new FemaleCMAutoSizeDto(autoSizeDto);
    }
    try {
      await validateOrReject(validatedAutoSizeDto);
    } catch (errors) {
      console.log('ERRORS', errors);
      const readableErrors = this.prettyPrintErrors(errors);
      console.log('READABLE', readableErrors);
      throw new BadRequestException(
        readableErrors,
        'Some values entered are not in the specified range',
      );
    }
    // if (autoSizeDto.gender === 'm') {
    //   const maleAutoSizeDto: MaleAutoSizeDto = new MaleAutoSizeDto(autoSizeDto);
    //   try {
    //     await validateOrReject(maleAutoSizeDto);
    //   } catch (errors) {
    //     const readableErrors = this.prettyPrintErrors(errors);
    //     throw new BadRequestException(
    //       readableErrors,
    //       'Some values entered are not in the specified range',
    //     );
    //   }
    // } else {
    //   // === 'w
    //   const femaleAutoSizeDto: FemaleAutoSizeDto = new FemaleAutoSizeDto(
    //     autoSizeDto,
    //   );
    //   try {
    //     await validateOrReject(femaleAutoSizeDto);
    //   } catch (errors) {
    //     const readableErrors = this.prettyPrintErrors(errors);
    //     throw new BadRequestException(
    //       readableErrors,
    //       'Some values entered are not in the specified range',
    //     );
    //   }
    // }
  }

  prettyPrintErrors(errors: any[]): string[] {
    const humanFriendlyErrors: string[] = [];
    for (const error of errors) {
      for (const constraint of Object.keys(error.constraints)) {
        humanFriendlyErrors.push(error.constraints[`${constraint}`]);
      }
    }
    return humanFriendlyErrors;
  }

  async confirmAutosizeMeasurement(
    confirmAutoSizeDto: ConfirmAutoSizeDto,
    user: UserAccount,
    file: Express.Multer.File,
  ): Promise<any> {
    let fileUrl: string;
    if (file) {
      fileUrl = (await this.imageUploaderService.uploadEventImage(file))
        .secure_url;
    }

    const measurement: Measurement =
      await this.MeasurementModel.findByIdAndUpdate(
        user.measurement,
        {
          measurementData: confirmAutoSizeDto,
        },
        { new: true },
      ).exec();
    console.log(measurement);
    let updatedMeasurements;
    const UsersMeasurements = {
      imageUrl: fileUrl,
      group: user.id,
      method: measurement.method,
      name: null,
      neck: confirmAutoSizeDto.neck,
      wrist: confirmAutoSizeDto.wrist,
      sleeveLength: confirmAutoSizeDto.sleeveLength,
      underArm: confirmAutoSizeDto.underArm,
      chest: confirmAutoSizeDto.chest,
      shortSleeve: confirmAutoSizeDto.shortSleeve,
      threeQuarterSleeve: confirmAutoSizeDto.threeQuarterSleeve,
      shoulder: confirmAutoSizeDto.shoulder,
      roundElbow: confirmAutoSizeDto.roundElbow,
      foreArm: confirmAutoSizeDto.foreArm,
      tommyCircumferenceTop: confirmAutoSizeDto.tommyCircumferenceTop,
      ankle: confirmAutoSizeDto.ankle,
      thighs: confirmAutoSizeDto.thighs,
      crotchLength: confirmAutoSizeDto.crotchLength,
      roundKnee: confirmAutoSizeDto.roundKnee,
      trouserWaist: confirmAutoSizeDto.trouserWaist,
      trouserInseam: confirmAutoSizeDto.trouserInseam,
      trouserHip: confirmAutoSizeDto.trouserHip,
      trouserLength: confirmAutoSizeDto.trouserLength,
      shoeSize: confirmAutoSizeDto.shoeSize,
      measurementId: randomBytes(20).toString('hex'),
      deleted: false,
      origin: null,
      version: 1,
      date: new Date(),
    };
    const checkMeasurementsVersion: any = await this.MeasurementVersion.findOne(
      {
        outfitBuyer: user.id,
      },
    ).exec();

    if (checkMeasurementsVersion) {
      UsersMeasurements.version =
        checkMeasurementsVersion.measurements[
          checkMeasurementsVersion.measurements.length - 1
        ].version + 1;
      updatedMeasurements = await this.MeasurementVersion.findByIdAndUpdate(
        checkMeasurementsVersion.id,
        {
          $push: {
            measurements: UsersMeasurements,
          },
        },
        { new: true },
      ).exec();
    } else {
      let newMeasurementsVersions: any;
      newMeasurementsVersions = new this.MeasurementVersion({
        outfitBuyer: user.id,
        measurements: UsersMeasurements,
      });
      updatedMeasurements = await newMeasurementsVersions.save();
    }
    return {
      status: 'ok',
      measurements: updatedMeasurements,
    };
  }

  private mapBoldMetricsMeasurementResponse(
    boldMetricsMeasurement: any,
  ): object {
    return {
      neck: +boldMetricsMeasurement.neck_circum_base,
      wrist: +boldMetricsMeasurement.wrist_circum + 1.8,
      sleeveLength: +boldMetricsMeasurement.acromion_radial_stylion_len + 1.1,
      underArm: +boldMetricsMeasurement.scye_circum,
      chest: +boldMetricsMeasurement.chest_circum + 2.6,
      shortSleeve: +boldMetricsMeasurement.acromion_radial_len - 3.0,
      threeQuarterSleeve: +boldMetricsMeasurement.arm_len_shoulder_elbow + 3.0,
      shoulder: +boldMetricsMeasurement.biacromial_breadth + 1.5,
      roundElbow: +boldMetricsMeasurement.elbow_circum,
      foreArm: +boldMetricsMeasurement.forearm_circum,
      tommyCircumferenceTop: +boldMetricsMeasurement.waist_circum_natural + 4.0,
      ankle: +boldMetricsMeasurement.ankle_circum + 3.5,
      thighs: +boldMetricsMeasurement.thigh_circum_proximal + 2.1,
      crotchLength: +boldMetricsMeasurement.u_crotch,
      roundKnee: +boldMetricsMeasurement.knee_circum + 1.7,
      trouserWaist: +boldMetricsMeasurement.waist_circum_preferred,
      trouserInseam: +boldMetricsMeasurement.jean_inseam - 1.5,
      trouserHip: +boldMetricsMeasurement.hip_circum + 2.0,
      trouserLength: +boldMetricsMeasurement.waist_height_preferred - 2.5,
    };
  }

  async getMeasurementHistory(user: UserAccount): Promise<any> {
    const measurementHistory = await this.MeasurementVersion.findOne({
      outfitBuyer: user.id,
    }).exec();
    return measurementHistory;
  }

  async cloneMeasurement(
    clonemeasurement: CloneMeasurementDto,
    user: UserAccount,
    file: Express.Multer.File,
  ): Promise<any> {
    let fileUrl: string;
    if (file) {
      fileUrl = (await this.imageUploaderService.uploadEventImage(file))
        .secure_url;
    }
    let updatedMeasurements;
    const UsersMeasurements = {
      imageUrl:
        fileUrl === null || fileUrl === undefined
          ? clonemeasurement.imageUrl
          : fileUrl,
      group: user.id,
      name: null,
      neck: clonemeasurement.neck,
      method: clonemeasurement.method,
      wrist: clonemeasurement.wrist,
      sleeveLength: clonemeasurement.sleeveLength,
      underArm: clonemeasurement.underArm,
      chest: clonemeasurement.chest,
      shortSleeve: clonemeasurement.shortSleeve,
      threeQuarterSleeve: clonemeasurement.threeQuarterSleeve,
      shoulder: clonemeasurement.shoulder,
      roundElbow: clonemeasurement.roundElbow,
      foreArm: clonemeasurement.foreArm,
      tommyCircumferenceTop: clonemeasurement.tommyCircumferenceTop,
      ankle: clonemeasurement.ankle,
      thighs: clonemeasurement.thighs,
      crotchLength: clonemeasurement.crotchLength,
      roundKnee: clonemeasurement.roundKnee,
      trouserWaist: clonemeasurement.trouserWaist,
      trouserInseam: clonemeasurement.trouserInseam,
      trouserHip: clonemeasurement.trouserHip,
      trouserLength: clonemeasurement.trouserLength,
      shoeSize: clonemeasurement.shoeSize,
      deleted: false,
      origin: clonemeasurement.origin,
      version: null,
      measurementId: randomBytes(20).toString('hex'),
      date: new Date(),
    };

    const checkMeasurementsVersion: any = await this.MeasurementVersion.findOne(
      {
        outfitBuyer: user.id,
      },
    ).exec();

    if (checkMeasurementsVersion) {
      UsersMeasurements.version =
        checkMeasurementsVersion.measurements[
          checkMeasurementsVersion.measurements.length - 1
        ].version + 1;
      updatedMeasurements = await this.MeasurementVersion.findByIdAndUpdate(
        checkMeasurementsVersion.id,
        {
          $push: {
            measurements: UsersMeasurements,
          },
        },
      ).exec();
    } else {
      let newMeasurementsVersions: any;
      newMeasurementsVersions = new this.MeasurementVersion({
        outfitBuyer: user.id,
        measurements: UsersMeasurements,
      });
      newMeasurementsVersions.version = 1;
      updatedMeasurements = await newMeasurementsVersions.save();
    }
    return {
      status: 'ok',
      message: updatedMeasurements,
    };
  }

  getSkippedAutoSizeMeasurement(user: UserAccount): Promise<Measurement> {
    return this.MeasurementModel.findById(user.measurement).exec();
  }

  skipAutoSizeMeasurement(
    skipAutoSizeMeasurementDto: SkipAutoSizeMeasurementDto,
    user: UserAccount,
  ): Promise<Measurement> {
    // handle user without measurement
    return this.MeasurementModel.findByIdAndUpdate(
      user.measurement,
      {
        skipAutosizeData: skipAutoSizeMeasurementDto,
      },
      { new: true },
    ).exec();
  }

  generateInviteCode(): string {
    return randomBytes(20).toString('hex').slice(0, 8);
  }

  getMockedResponse(): any {
    const mockedResponse: any = {
      code: 200,
      customer: {
        age: 22,
        gender: 'm',
        height: '66.00',
        sleeve_type: 'ARS',
        waist_circum_preferred: '25.00',
        weight: '120.00',
      },
      dimensions: {
        acromion_height: '53.78',
        acromion_radial_len: '12.01',
        acromion_radial_stylion_len: '21.94',
        ankle_circum: '9.43',
        arm_len_shoulder_elbow: '12.56',
        arm_len_shoulder_wrist: '23.49',
        arm_len_spine_wrist: '31.15',
        axilla_height: '49.45',
        biacromial_breadth: '15.32',
        biceps_circum: '10.55',
        bideltoid_breadth: '16.99',
        cervical_height: '56.37',
        chest_circum: '33.32',
        chest_circum_below_bust: '31.70',
        chest_circum_scye: '34.42',
        elbow_circum: '9.84',
        fm_shoulder: '14.98',
        forearm_circum: '10.54',
        hand_len: '7.41',
        height: '66.00',
        hip_circum: '34.25',
        interscye_dist: '13.82',
        interscye_dist_mid_scye: '15.10',
        jean_inseam: '30.09',
        knee_circum: '13.51',
        neck_circum_base: '16.21',
        neck_circum_larynx: '13.05',
        neck_height_lateral: '55.95',
        overarm: '42.08',
        radial_stylion_len: '9.87',
        scye_circum: '15.26',
        shirt_len_tucked_2: '28.32',
        shirt_len_untucked_2: '26.24',
        shoulder_len: '4.99',
        sleeve_inseam: '17.20',
        sleeve_outseam: '22.22',
        thigh_circum_distal: '12.95',
        thigh_circum_proximal: '19.61',
        u_crotch: '22.89',
        upper_arm_circum: '10.84',
        waist_breadth_navel: '10.22',
        waist_circum_natural: '26.53',
        waist_circum_preferred: '25.00',
        waist_circum_stomach: '27.59',
        waist_depth_navel: '7.00',
        waist_height_natural: '41.86',
        waist_height_preferred: '38.98',
        waist_height_stomach: '39.85',
        weight: '120.00',
        wrist_circum: '6.59',
        wrist_height: '31.25',
      },
      // message: "4 inputs provided. Minimum of 6 inputs are recommended for a strong accuracy.",
      outlier: false,
      outlier_messages: {
        // overall: "Confidence errors",
        // specifics: [
        //   {
        //     field: "waist_circum_preferred",
        //     message: "waist_circum_preferred is inconsistent with weight.",
        //   },
        // ],
      },
      unused_parameters: [],
    };
    return mockedResponse;
  }
}

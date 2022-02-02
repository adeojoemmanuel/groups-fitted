import { HttpException, Injectable } from '@nestjs/common';
import { AddTailorDto } from 'src/tailor/dto/add-tailor.dto';
import * as twilio from 'twilio';
import { config } from '../../config/index';
import { AddRecipientDto } from '../../groups/dto/add-recipient.dto';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class MessagingService {
  client: any;
  constructor(private loggerService: LoggerService) {
    this.client = twilio(config.twilio.accountSid, config.twilio.authToken);
  }

  public async sendOtpSMS(phoneNumber, otpCode): Promise<void> {
    try {
      const message = await this.client.messages.create({
        to: phoneNumber,
        from: '+18508096815',
        body: 'This is your OTP code from Fitted ' + otpCode,
      });
    } catch (e) {
      this.loggerService.error(e, 'Error');
    }
  }

  async sendGroupRecipientInvitation(
    addRecipientDto: AddRecipientDto,
    initiatorName: string,
    eventName: string,
    eventUrl: string,
    inviteLink: string,
  ): Promise<boolean> {
    try {
      const message = await this.client.messages.create({
        to: addRecipientDto.phoneNumber,
        from: '+18508096815',
        body: `${initiatorName} has invited you to join ${eventName} group on Fitted, Click the link to view and accept the invitation: ${inviteLink} `,
      });
    } catch (e) {
      this.loggerService.error(e, 'Error');
    }
    return true;
  }

  async sendTailorInvite(
    addTailorDto: AddTailorDto,
    initiatorName: string,
    inviteLink: string,
  ): Promise<boolean> {
    const message = await this.client.messages.create({
      to: addTailorDto.phoneNumber,
      from: '+18508096815',
      body: `${initiatorName} has invited you view his measurement, Click the link to view his measurement and accept the invitation: ${inviteLink} `,
    });
    return true;
  }

  async sendMeasurementToTailor(phonNo: string, data: any): Promise<boolean> {
    const text = `
    waist_circum_preferred: ${data.waist_circum_preferred},
    sleeve_type": "ARS",
    height: ${data.height},
    weight: ${data.weight},
    age:  ${data.age},
    gender: ${data.gender},
    neck":  ${data.neck},
    wrist:  ${data.wrist},
    sleeveLength:  ${data.sleeveLength},
    underArm:  ${data.underArm},
    chest":  ${data.chest},
    shortSleeve: ${data.shortSleeve},
    threeQuarterSleeve:  ${data.threeQuarterSleeve},
    shoulder:  ${data.shoulder},
    roundElbow:  ${data.roundElbow},
    foreArm:  ${data.foreArm},
    tommyCircumferenceTop:  ${data.tommyCircumferenceTop},
    ankle:  ${data.ankle},
    thighs:  ${data.thighs},
    crotchLength: ${data.crotchLength},
    roundKnee:  ${data.roundKnee},
    trouserWaist:  ${data.trouserWaist},
    trouserInseam:  ${data.trouserInseam},
    trouserHip:  ${data.trouserHip},
    trouserLength:  ${data.trouserLength},
    `;

    const message = await this.client.messages.create({
      to: phonNo,
      from: '+18508096815',
      body: text,
    });
    return true;
  }
}

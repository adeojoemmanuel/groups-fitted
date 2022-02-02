import { BadRequestException, Injectable } from '@nestjs/common';
import * as sendGrid from '@sendgrid/mail';
import * as fs from 'fs';
import * as mustache from 'mustache';
import { EmailVerificationDocument } from 'src/auth/models/emailVerification.model';
import { AddRecipientDto } from 'src/groups/dto/add-recipient.dto';
import { AddTailorDto } from 'src/tailor/dto/add-tailor.dto';
import { EmailVerification } from '../../auth/models/emailVerification.model';
import { PasswordRecoveryDocument } from '../../auth/models/password-recovery.model';
import { config } from '../../config/index';
import { Event } from '../../groups/models/event.model';
import { UserAccount } from '../../users/models/user-account.schema';

@Injectable()
export class MailingService {
  constructor() {
    sendGrid.setApiKey(config.sendGrid.apiKey);
  }

  async sendMessage(message): Promise<string> {
    try {
      const sendMail = await sendGrid.send(message);
      return 'Successful';
    } catch (error) {
      console.log('Message Not Sent');
      console.log(error);
      return 'Unsuccessful';
    }
  }

  async sendConfirmationEmail(
    emailVerification: EmailVerification,
    firstName: string,
  ): Promise<string> {
    const msg = {
      to: emailVerification.email,
      from: config.sendGrid.fromEmail,
      templateId: config.sendGrid.accountVerificationEmail,
      dynamic_template_data: {
        subject: 'Verify Fitted Account',
        firstName,
        accountVerificationUrl: `${config.accountVerificationUrl}?confirmationCode=${emailVerification.confirmationCode}`,
      },
    };
    return this.sendMessage(msg);
  }

  async sendOutfitBuyerFirstEventEmail(
    user: UserAccount,
    event: Event,
  ): Promise<string> {
    const msg = {
      to: user.email,
      from: config.sendGrid.fromEmail,
      templateId: config.sendGrid.outfitBuyerFirstEventEmail,
      dynamic_template_data: {
        outfitBuyerInitiatorName: user.firstName,
        eventUrl: `${config.frontendUrl}/events/${event.link}`,
        eventName: event.name,
      },
    };
    return this.sendMessage(msg);
  }

  async sendCreateEventMail(user: UserAccount, event: Event): Promise<string> {
    const msg = {
      to: user.email,
      from: config.sendGrid.fromEmail,
      templateId: config.sendGrid.existingUserCreateEventEmail,
      dynamic_template_data: {
        outfitBuyerInitiatorName: user.firstName,
        eventUrl: `${config.frontendUrl}/events/${event.link}`,
        eventName: event.name,
      },
    };
    return this.sendMessage(msg);
  }

  async UserSignUpEmail(user: any): Promise<string> {
    const msg = {
      to: user.email,
      from: config.sendGrid.fromEmail,
      templateId: config.sendGrid.memberSignUpEmail,
      dynamic_template_data: {
        subject: 'Sign Up Email',
        name: user.name,
      },
    };
    return this.sendMessage(msg);
  }

  async TailorSignUpWithPassword(
    email: string,
    password: string,
  ): Promise<string> {
    const msg = {
      to: email,
      from: config.sendGrid.fromEmail,
      templateId: config.sendGrid.TAILOR_SIGNUP_EMAIL_PASSWORD_ID,
      dynamic_template_data: {
        subject: 'Sign Up Email',
        signUpLink: config.sendGrid.TAILOR_LINK,
        password,
      },
    };
    return this.sendMessage(msg);
  }

  async sendPasswordRecoveryEmail(
    existingRecovery: PasswordRecoveryDocument,
    firstName: string,
  ): Promise<string> {
    const msg = {
      to: existingRecovery.email,
      from: config.sendGrid.fromEmail,
      templateId: config.sendGrid.passwordRecoveryEmail,
      dynamic_template_data: {
        subject: 'Reset Password Email',
        firstName,
        passwordRecoveryUrl: `${config.passwordRecoveryUrl}?recoveryCode=${existingRecovery.recoveryCode}`,
      },
    };
    return this.sendMessage(msg);
  }

  async sendGroupRecipientInvitation(
    addRecipientDto: AddRecipientDto,
    initiatorName: string,
    eventName: string,
    eventLink: string,
    inviteLink: string,
  ): Promise<string> {
    const msg = {
      to: addRecipientDto.email,
      from: config.sendGrid.fromEmail,
      templateId: config.sendGrid.recipientInviteEmail,
      dynamic_template_data: {
        groupInitiatorName: initiatorName,
        eventLink: `${config.frontendUrl}/events/${eventLink}`,
        recipientName: addRecipientDto.firstName,
        eventName,
        inviteLink,
      },
    };
    return this.sendMessage(msg);
  }

  async sendTailorMeasurement(
    addTailorDto: AddTailorDto,
    user: UserAccount,
    eventLink: string,
  ): Promise<string> {
    const msg = {
      to: addTailorDto.email,
      from: config.sendGrid.fromEmail,
      templateId: config.sendGrid.TAILOR_INVITE,
      dynamic_template_data: {
        outfitBuyer: `${user.firstName} ${user.lastName}`,
        tailorName: addTailorDto.firstName,
        link: eventLink,
      },
    };
    return this.sendMessage(msg);
  }

  // async sendRegisteredTailorMeasurement(
  //   tailorDto: TailorSignupDto,
  //   initiatorName: string,
  //   eventName: string,
  //   eventUrl: string,
  //   inviteLink: string,
  // ): Promise<string> {
  //   return this.sendMessage(msg);
  // }

  // async sendTailorInvitationAndMeasurement(
  //   tailorDto: TailorSignupDto,
  //   initiatorName: string,
  //   eventName: string,
  //   eventUrl: string,
  //   inviteLink: string,
  // ): Promise<string> {
  //   return this.sendMessage(msg);
  // }

  // async sendEmailWithoutAttatchment(
  //   email: string,
  //   subject: string,
  //   tempName: string,
  // ): Promise<string> {
  //   const msg = {
  //     to: email,
  //     cc: ['ibi@fitted.ng', 'david@fitted.ng'],
  //     from: 'qa@fitted.ng',
  //     subject,
  //     html: fs.readFileSync(`src/mailing/templates/${tempName}.html`, {
  //       encoding: 'utf-8',
  //     }),
  //   };

  //   try {
  //     const sendMail = await sendGrid.send(msg);
  //     return 'Successful';
  //   } catch (error) {
  //     throw new BadRequestException(`${error}`);
  //   }
  // }

  // async generateEmail(data: any, tempName: string): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     const template = fs.readFileSync(`src/mailing/emails/${tempName}.html`, {
  //       encoding: 'utf-8',
  //     });
  //     const output = mustache.render(template, data);

  //     const writeStream = fs.createWriteStream(
  //       `src/mailing/templates/${tempName}.html`,
  //     );
  //     writeStream.write(output);
  //     writeStream.end();
  //     writeStream.on('finish', () => {
  //       resolve({
  //         message: 'Email saved to temp folder',
  //       });
  //     });
  //   });
  // }

  // async newTailorEmail(data: any): Promise<boolean> {
  //   await this.generateEmail(data.data, 'newTailor');
  //   await this.sendEmailWithoutAttatchment(
  //     data.email,
  //     `new_tailor-${data.data.Name}`,
  //     'newTailor',
  //   );
  //   return true;
  // }

  // async sendConfirmationEmail(
  //   createdConfirmation: EmailVerificationDocument,
  // ): Promise<void> {
  //   // throw new Error('Method not implemented.');
  //   // use Sendgrid
  // }
}

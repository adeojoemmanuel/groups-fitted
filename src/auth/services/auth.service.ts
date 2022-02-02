import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { isEmail } from 'class-validator';
import { randomBytes } from 'crypto';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { Embroiderer } from 'src/users/models/embroiderer.schema';
import { FabricSeller } from 'src/users/models/fabric-seller.schema';
import { config } from '../../config/index';
import { OutfitBuyer } from '../../users/models/outfit-buyer.schema';
import { userRoles } from '../../users/models/roles.enum';
import { Tailor, TailorDocument } from '../../users/models/tailor.schema';
import {
  UserAccount,
  UserAccountDocument,
} from '../../users/models/user-account.schema';
import { UsersService } from '../../users/services/users.service';
import { MailingService } from '../../utils/mailing/mailing.service';
import { MessagingService } from '../../utils/messaging/messaging.service';
import { EmailLoginDto } from '../dtos/email-login.dto';
import { EmbroidererSignupDto } from '../dtos/embroiderer.signup.dto';
import { FabricSellerSignupDto } from '../dtos/fabric-seller.signup.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { OutfitBuyerSignupResponseDto } from '../dtos/outfit-buyer-signup-response.dto';
import { OutfitBuyerSignupDto } from '../dtos/outfit-buyer.signup.dto';
import { PasswordResetWithCodeDto } from '../dtos/password-reset-with-code.dto';
import { PasswordResetDto } from '../dtos/password-reset.dto';
import { PasswordlessLoginDto } from '../dtos/passwordless-login.dto';
import { PhoneNumberLoginDto } from '../dtos/phoneNumber-login.dto';
import { RequestOtpDto } from '../dtos/request-otp.dto';
import { TailorSignupPasswordResponseDto } from '../dtos/tailor-signup-password-response';
import { TailorSignupPasswordDto } from '../dtos/tailor-signup-password.dto';
import { TailorSignupResponseDto } from '../dtos/tailor-signup-response.dto';
import { TailorSignupDto } from '../dtos/tailor.signup.dto';
import {
  EmailVerification,
  EmailVerificationDocument,
} from '../models/emailVerification.model';
import {
  PasswordRecovery,
  PasswordRecoveryDocument,
} from '../models/password-recovery.model';
import {
  OtpVerification,
  OtpVerificationDocument,
} from '../models/phoneVerification.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @InjectModel(OtpVerification.name)
    private OtpVerificationModel: Model<OtpVerificationDocument>,
    @InjectModel(EmailVerification.name)
    private EmailVerificationModel: Model<EmailVerificationDocument>,
    @InjectModel(PasswordRecovery.name)
    private PasswordRecoveryModel: Model<PasswordRecoveryDocument>,
    @InjectModel(UserAccount.name)
    private UserAccountModel: Model<UserAccountDocument>,
    @InjectModel(Tailor.name) private TailorModel: Model<TailorDocument>,
    private messagingService: MessagingService,
    private jwt: JwtService,
    private mailingService: MailingService,
  ) {}

  async resetPasswordWithRecoveryCode(
    passwordResetWithCodeDto: PasswordResetWithCodeDto,
  ): Promise<boolean> {
    const passwordRecovery = await this.PasswordRecoveryModel.findOne({
      recoveryCode: passwordResetWithCodeDto.recoveryCode,
    }).exec();

    if (!passwordRecovery) {
      throw new UnauthorizedException('Invalid verification code!');
    }

    const password = await bcrypt.hash(
      passwordResetWithCodeDto.newPassword,
      10,
    );
    await this.UserAccountModel.findOneAndUpdate(
      { email: passwordRecovery.email },
      {
        password,
      },
    ).exec();
    await this.PasswordRecoveryModel.findByIdAndDelete(
      passwordRecovery.id,
    ).exec();
    return true;
  }

  async recoverPassword(email: string): Promise<boolean> {
    const recoveryCode = randomBytes(20).toString('hex');

    let existingRecovery = await this.PasswordRecoveryModel.findOne({
      email,
    }).exec();

    if (existingRecovery) {
      existingRecovery.recoveryCode = recoveryCode;
      existingRecovery.expires = moment()
        .add(config.passwordRecoveryTtl, 'hours')
        .toDate();
      await existingRecovery.save();
    } else {
      const recovery = new this.PasswordRecoveryModel({
        email,
        recoveryCode,
        expires: moment().add(config.passwordRecoveryTtl, 'hours').toDate(),
      });
      existingRecovery = await recovery.save();
    }

    const user = await this.usersService.getUserAccountByEmail(
      existingRecovery.email,
    );

    if (user) {
      try {
        await this.mailingService.sendPasswordRecoveryEmail(
          existingRecovery,
          user.firstName,
        );
      } catch (e) {
        console.log(
          `An error has occurred on sending Email Notification, ${e}`,
        );
      }
    }

    return true;
  }

  resetPassword(user: UserAccount, passwordResetDto: PasswordResetDto): void {
    throw new Error('Method not implemented.');
  }

  async sendConfirmationEmail(email: string): Promise<string> {
    if (!isEmail(email.trim())) {
      throw new BadRequestException('Invalid email address!');
    }
    const confirmationId = randomBytes(20).toString('hex');
    const user = await this.usersService.getUserAccountByEmail(email);
    if (!user || user.isConfirmed) {
      return 'Email already confirmed';
    }

    let existingConfirmation: EmailVerification =
      await this.EmailVerificationModel.findOne({ email: user.email }).exec();

    if (!existingConfirmation) {
      existingConfirmation = {
        email: user.email,
        confirmationCode: confirmationId,
        expires: moment().add(config.accountVerificationTtl, 'days').toDate(),
      };
    }
    let createdConfirmation = new this.EmailVerificationModel(
      existingConfirmation,
    );
    createdConfirmation = await createdConfirmation.save();
    this.mailingService.sendConfirmationEmail(
      createdConfirmation,
      user.firstName,
    );
    return 'Successful';
  }

  async confirmEmail(
    confirmationCode: string,
    email: string,
  ): Promise<boolean> {
    const confirmationCodeExists = await this.EmailVerificationModel.findOne({
      email,
    }).exec();

    if (!confirmationCodeExists) {
      throw new BadRequestException('Confirmation Code Does Not Exists!');
    }

    const user = await this.usersService.getUserAccountByEmail(
      confirmationCodeExists.email,
    );

    if (!user) {
      throw new BadRequestException(
        'User requesting email confirmation does not exist!',
      );
    }

    await this.UserAccountModel.findOneAndUpdate(
      { id: user.id },
      { isConfirmed: true },
    ).exec();

    this.EmailVerificationModel.deleteOne({
      id: confirmationCodeExists.id,
    });

    return true;
  }

  async resendSignupOtp(otpDto: RequestOtpDto): Promise<boolean> {
    const otpCode = this.generateOtp();
    const otpVerification = await this.OtpVerificationModel.findOne({
      phoneNumber: otpDto.phoneNumber,
    }).exec();
    if (!otpVerification) {
      return this.sendSignupOtp(otpDto);
    }
    otpVerification.otpCode = otpCode.toString();
    otpVerification.expires = moment().add(config.otpTtl, 'seconds').toDate();
    await otpVerification.save();
    await this.messagingService.sendOtpSMS(otpDto.phoneNumber, otpCode);
    return true;
  }

  async sendSignupOtp(otpDto: RequestOtpDto): Promise<boolean> {
    const otpCode = this.generateOtp();
    let newOtpVerification: any = {
      phoneNumber: otpDto.phoneNumber,
      otpCode,
      expires: moment().add(config.otpTtl, 'seconds').toDate(),
    };
    newOtpVerification = new this.OtpVerificationModel(newOtpVerification);
    await newOtpVerification.save();
    await this.messagingService.sendOtpSMS(otpDto.phoneNumber, otpCode);
    return true;
  }

  async passwordlessLogin(
    passwordlessLoginDto: PasswordlessLoginDto,
  ): Promise<LoginResponseDto> {
    const { otp, phoneNumber } = passwordlessLoginDto;
    await this.verifyOtp(otp, phoneNumber);
    const user = await this.usersService.getUserAccountByPhoneNumber(
      phoneNumber,
    );
    return this.loginUser(user, null, true);
  }

  async loginWithPhoneNumber(
    loginDto: PhoneNumberLoginDto,
  ): Promise<LoginResponseDto> {
    const { phoneNumber, password } = loginDto;
    const user = await this.usersService.getUserAccountByPhoneNumber(
      phoneNumber,
    );

    return this.loginUser(user, password, false);
  }

  async loginWithEmail(loginDto: EmailLoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    const user = await this.usersService.getUserAccountByEmail(email);

    return this.loginUser(user, password, false);
  }

  private async loginUser(
    user: UserAccountDocument,
    password: string,
    passwordLess: boolean,
  ): Promise<LoginResponseDto> {
    if (!user) {
      throw new UnauthorizedException(
        'SignIn Failed!, Incorrect login credentials',
      );
    }
    if (!passwordLess) {
      const userPassword = await this.usersService.getUserAccountPassword(
        user.email,
      );
      const isCorrectPassword = await bcrypt.compare(password, userPassword);

      if (!isCorrectPassword) {
        throw new UnauthorizedException(
          'SignIn Failed!, Incorrect login credentials',
        );
      }
    }

    const payload = {
      email: user.email,
      sub: user.id,
      phoneNumber: user.phoneNumber,
    };

    return {
      accessToken: this.jwt.sign(payload),
      user,
    };
  }

  async signupAsOutfitBuyer(
    outfitBuyerSignupDto: OutfitBuyerSignupDto,
  ): Promise<OutfitBuyerSignupResponseDto> {
    this.checkPasswordMatches(
      outfitBuyerSignupDto.password,
      outfitBuyerSignupDto.confirmPassword,
    );
    await this.checkUserAccountEmailExists(outfitBuyerSignupDto.email);
    await this.checkUserAccountPhoneNumberExists(
      outfitBuyerSignupDto.phoneNumber,
    );
    const outfitBuyer: any = await this.usersService.createOutfitBuyer(
      outfitBuyerSignupDto,
    );
    const payload = {
      email: outfitBuyer.userAccount.email,
      sub: outfitBuyer.userAccount._id,
      phoneNumber: outfitBuyer.userAccount.phoneNumber,
    };

    await this.sendConfirmationEmail(outfitBuyerSignupDto.email);

    this.mailingService.UserSignUpEmail({
      email: outfitBuyerSignupDto.email,
      name: outfitBuyerSignupDto.firstName,
    });

    return {
      accessToken: this.jwt.sign(payload),
      outfitBuyer,
    };
  }

  async signupAsTailorPassword(
    tailorSignUpasswordpDto: TailorSignupPasswordDto,
  ): Promise<TailorSignupPasswordResponseDto> {
    if (tailorSignUpasswordpDto.type === 'new') {
      await this.checkUserAccountEmailExists(tailorSignUpasswordpDto.email);
      await this.checkUserAccountPhoneNumberExists(
        tailorSignUpasswordpDto.phoneNumber,
      );
      const password = await this.generatePassword(7);
      const tailor: any = await this.usersService.createTailorPassword({
        ...tailorSignUpasswordpDto,
        password,
      });
      const payload = {
        email: tailor.userAccount.email,
        sub: tailor.userAccount._id,
        phoneNumber: tailor.userAccount.phoneNumber,
      };

      this.mailingService.TailorSignUpWithPassword(
        tailorSignUpasswordpDto.email,
        password,
      );
      return {
        accessToken: this.jwt.sign(payload),
        tailor,
      };
    } else {
      const user: UserAccount = await this.usersService.updateRole(
        tailorSignUpasswordpDto.email,
        userRoles.Tailor,
      );
      let newTailorAccount: any = {
        location: tailorSignUpasswordpDto.location,
        customerCategory: tailorSignUpasswordpDto.customerCategory,
        userAccount: user.id,
      };
      const payload = {
        email: user.email,
        sub: user.id,
        phoneNumber: user.phoneNumber,
      };
      newTailorAccount = new this.TailorModel(newTailorAccount);
      const tailorAccount = await newTailorAccount.save();
      return {
        accessToken: this.jwt.sign(payload),
        tailor: tailorAccount,
      };
    }
  }

  async generatePassword(length): Promise<any> {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    console.log(result);
    return result;
  }

  async signupAsTailor(
    tailorSignupDto: TailorSignupDto,
  ): Promise<TailorSignupResponseDto> {
    await this.checkUserAccountEmailExists(tailorSignupDto.email);
    await this.checkUserAccountPhoneNumberExists(tailorSignupDto.phoneNumber);
    await this.verifyOtp(tailorSignupDto.otp, tailorSignupDto.phoneNumber);
    const tailor: any = await this.usersService.createTailor(tailorSignupDto);

    const payload = {
      email: tailor.userAccount.email,
      sub: tailor.userAccount._id,
      phoneNumber: tailor.userAccount.phoneNumber,
    };

    return {
      accessToken: this.jwt.sign(payload),
      tailor,
    };
  }

  async signupAsFabricSeller(
    fabricSellerSignupDto: FabricSellerSignupDto,
  ): Promise<FabricSeller> {
    await this.checkUserAccountEmailExists(fabricSellerSignupDto.email);
    await this.checkUserAccountPhoneNumberExists(
      fabricSellerSignupDto.phoneNumber,
    );
    await this.verifyOtp(
      fabricSellerSignupDto.otp,
      fabricSellerSignupDto.phoneNumber,
    );
    return this.usersService.createFabricSeller(fabricSellerSignupDto);
  }

  async signupAsEmbroiderer(
    embroidererSignupDto: EmbroidererSignupDto,
  ): Promise<Embroiderer> {
    await this.checkUserAccountEmailExists(embroidererSignupDto.email);
    await this.checkUserAccountPhoneNumberExists(
      embroidererSignupDto.phoneNumber,
    );
    await this.verifyOtp(
      embroidererSignupDto.otp,
      embroidererSignupDto.phoneNumber,
    );
    return this.usersService.createEmbroiderer(embroidererSignupDto);
  }

  private async checkUserAccountEmailExists(email: string): Promise<void> {
    const userAccountExists: boolean =
      await this.usersService.checkUserAccountEmailExists(email);
    if (userAccountExists) {
      throw new ConflictException(
        'An account with this email exists, use a different email',
      );
    }
  }

  private async checkUserAccountPhoneNumberExists(
    phoneNumber: string,
  ): Promise<void> {
    const userAccountExists: boolean =
      await this.usersService.checkUserAccountPhoneNumberExists(phoneNumber);
    if (userAccountExists) {
      throw new ConflictException(
        'An account with this phone number exists, use a different phone number',
      );
    }
  }

  public generateOtp(): number {
    let otp = '';
    for (let i = 0; i < 4; i++) {
      const randomNum = Math.ceil(Math.random() * 9);
      otp += randomNum;
    }
    return parseInt(otp, 10);
  }

  async validate(id: string): Promise<UserAccount> {
    const user = await this.usersService.getUserAccountById(id);
    if (!user) {
      throw new UnauthorizedException(`User with id ${id} does not exist!`);
    }
    return user;
  }

  public async verifyOtp(otp: string, phoneNumber: string): Promise<boolean> {
    const otpModel: OtpVerification = await this.OtpVerificationModel.findOne({
      phoneNumber,
    }).exec();
    if (otpModel === null) {
      throw new NotFoundException(
        'You have not requested an OTP or OTP has expired',
      );
    }
    if (moment().toDate() > otpModel.expires) {
      throw new NotFoundException('This OTP has expired');
    }

    if (otp !== otpModel.otpCode) {
      throw new NotFoundException('The OTP code is incorrect');
    }

    return true;
  }

  public async verifyEmail(confirmationCode: string): Promise<boolean> {
    const emailVerificationModel: EmailVerification =
      await this.EmailVerificationModel.findOne({
        confirmationCode,
      }).exec();
    if (emailVerificationModel === null) {
      throw new NotFoundException('Email already confirmed');
    }
    if (moment().toDate() > emailVerificationModel.expires) {
      throw new NotFoundException('Email Verification Link has expired');
    }

    const user = await this.UserAccountModel.findOneAndUpdate(
      { email: emailVerificationModel.email },
      { isConfirmed: true },
    ).exec();

    return true;
  }

  private checkPasswordMatches(
    password: string,
    confirmPassword: string,
  ): boolean {
    if (password === confirmPassword) {
      return true;
    }
    throw new BadRequestException(
      `password and confirmPassword fields do not match`,
    );
  }
}

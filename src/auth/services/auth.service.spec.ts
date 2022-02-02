import { JwtModule } from '@nestjs/jwt';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import * as chance from 'chance';
import * as moment from 'moment';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { config } from '../../config/index';
import { Embroiderer } from '../../users/models/embroiderer.schema';
import { FabricSeller } from '../../users/models/fabric-seller.schema';
import { OutfitBuyer } from '../../users/models/outfit-buyer.schema';
import { Tailor, TailorSchema } from '../../users/models/tailor.schema';
import {
  UserAccount,
  UserAccountDocument,
  UserAccountSchema,
} from '../../users/models/user-account.schema';
import { UsersService } from '../../users/services/users.service';
import { UsersModule } from '../../users/users.module';
import {
  otpVerificationStub,
  userAccountStub,
} from '../../users/__stubs__/modelStubs';
import {
  embroidererStub,
  fabricSellerStub,
  outfitBuyerStub,
  tailorStub,
} from '../../users/__stubs__/modelStubs';
import { LoggerModule } from '../../utils/logger/logger.module';
import { MailingModule } from '../../utils/mailing/mailing.module';
import { MessagingModule } from '../../utils/messaging/messaging.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../utils/tests/mongoMock';
import { JwtStrategy } from '../guards/jwt.strategy';
import {
  EmailVerification,
  EmailVerificationSchema,
} from '../models/emailVerification.model';
import {
  PasswordRecovery,
  PasswordRecoverySchema,
} from '../models/password-recovery.model';
import {
  OtpVerification,
  OtpVerificationDocument,
  OtpVerificationSchema,
} from '../models/phoneVerification.model';
import { MockUsersService } from '../__mocks__/usersService';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let userAccountModel: Model<UserAccountDocument>;
  let otpVerificationModel: Model<OtpVerificationDocument>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: config.secret,
          signOptions: { expiresIn: '60s' },
        }),
        LoggerModule,
        MessagingModule,
        MailingModule,
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'UserAccount', schema: UserAccountSchema },
          { name: 'OtpVerification', schema: OtpVerificationSchema },
          { name: 'EmailVerification', schema: EmailVerificationSchema },
          { name: PasswordRecovery.name, schema: PasswordRecoverySchema },
          { name: Tailor.name, schema: TailorSchema },
        ]),
      ],
      providers: [
        AuthService,
        JwtStrategy,
        UsersService,
        // ...mongooseModelTokens,
      ],
    })
      .overrideProvider(UsersService)
      .useValue(MockUsersService)
      .compile();

    authService = moduleRef.get<AuthService>(AuthService);
    usersService = moduleRef.get<UsersService>(UsersService);
    userAccountModel =
      moduleRef.get<Model<UserAccountDocument>>('UserAccountModel');
    otpVerificationModel = moduleRef.get<Model<OtpVerificationDocument>>(
      'OtpVerificationModel',
    );
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validate()', () => {
    it('should return a user object when credentials are valid', async () => {
      const id = mongoose.Types.ObjectId().toString();

      const response = await authService.validate(id);

      expect(usersService.getUserAccountById).toBeCalledWith(id);
      expect(response).toBeInstanceOf(UserAccount);
      expect(response).toEqual(userAccountStub());
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const id = '2';
      usersService.getUserAccountById = jest.fn().mockResolvedValueOnce(null);
      const res = authService.validate(id);
      await expect(res).rejects.toThrowError(
        `User with id ${id} does not exist!`,
      );
    });
  });

  describe('verifyOtp()', () => {
    it('should return true on successful Otp Verification', async () => {
      jest.spyOn(otpVerificationModel, 'findOne');
      await otpVerificationModel.create(otpVerificationStub());
      const otp = '1234';

      const response = await authService.verifyOtp(otp, '+2347041538969');

      expect(otpVerificationModel.findOne).toBeCalledWith({
        phoneNumber: '+2347041538969',
      });
      expect(response).toEqual(true);
      await Promise.resolve(otpVerificationModel.deleteMany({}));
    });

    it('should throw error on no OTP found', async () => {
      jest.spyOn(otpVerificationModel, 'findOne');
      const otp = '123456';

      const response = authService.verifyOtp(otp, '+2347041538969');

      expect(otpVerificationModel.findOne).toBeCalledWith({
        phoneNumber: '+2347041538969',
      });
      await expect(response).rejects.toThrowError(
        'You have not requested an OTP or OTP has expired',
      );
    });

    it('should throw error when OTP has expired', async () => {
      const otp = otpVerificationStub();
      await otpVerificationModel.create(otp);
      await Promise.resolve(
        otpVerificationModel.findOneAndUpdate(
          { phoneNumber: otp.phoneNumber },
          {
            expires: moment()
              .subtract(config.otpTtl + 50, 'seconds')
              .toDate(),
          },
        ),
      );
      jest.spyOn(otpVerificationModel, 'findOne');
      const otpCode = '1234';

      const response = authService.verifyOtp(otpCode, '+2347041538969');

      expect(otpVerificationModel.findOne).toBeCalledWith({
        phoneNumber: '+2347041538969',
      });
      await expect(response).rejects.toThrowError('This OTP has expired');
      await Promise.resolve(otpVerificationModel.deleteMany({}));
    });

    it('should throw error when OTP code does not match', async () => {
      const otp = otpVerificationStub();
      await otpVerificationModel.create(otp);
      jest.spyOn(otpVerificationModel, 'findOne');
      const otpCode = '9876';

      const response = authService.verifyOtp(otpCode, '+2347041538969');

      expect(otpVerificationModel.findOne).toBeCalledWith({
        phoneNumber: '+2347041538969',
      });
      await expect(response).rejects.toThrowError('The OTP code is incorrect');
      await Promise.resolve(otpVerificationModel.deleteMany({}));
    });
  });

  describe('generateOtp()', () => {
    it('should generate 4 digit numeric otp code', async () => {
      const response = authService.generateOtp();

      expect(response.toString()).toHaveLength(4);
    });
  });

  describe('signupAsEmbroiderer()', () => {
    it('should return an Embroiderer upon successful creation', async () => {
      jest.spyOn(authService, 'verifyOtp').mockResolvedValueOnce(true);
      jest
        .spyOn(usersService, 'checkUserAccountEmailExists')
        .mockResolvedValueOnce(false);
      jest
        .spyOn(usersService, 'checkUserAccountPhoneNumberExists')
        .mockResolvedValueOnce(false);
      const mockRequest = {
        email: 'John@doe4.com',
        phoneNumber: '+2341111223333',
        otp: '567890',
        password: 'password',
        confirmPassword: 'password',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'male',
        location: 'Lagos, Nigeria',
      };
      const response = await authService.signupAsEmbroiderer(mockRequest);
      expect(response).toEqual(embroidererStub());
      expect(response).toHaveProperty('userAccount');
    });
  });

  describe('signupAsFabricSeller()', () => {
    it('should return a Fabric Seller upon successful creation', async () => {
      jest.spyOn(authService, 'verifyOtp').mockResolvedValueOnce(true);
      jest
        .spyOn(usersService, 'checkUserAccountPhoneNumberExists')
        .mockResolvedValueOnce(false);
      jest
        .spyOn(usersService, 'checkUserAccountEmailExists')
        .mockResolvedValueOnce(false);
      const mockRequest = {
        email: 'John@doe1.com',
        phoneNumber: '+2341111223333',
        otp: '567890',
        password: 'password',
        confirmPassword: 'password',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'male',
        location: 'Lagos, Nigeria',
        customerCategory: 'male',
      };
      const response = await authService.signupAsFabricSeller(mockRequest);
      expect(response).toEqual(fabricSellerStub());
      expect(response).toHaveProperty('userAccount');
    });
  });

  describe('signupAsTailor()', () => {
    it('should return a Tailor upon successful creation', async () => {
      jest.spyOn(authService, 'verifyOtp').mockResolvedValueOnce(false);
      jest
        .spyOn(usersService, 'checkUserAccountPhoneNumberExists')
        .mockResolvedValueOnce(false);
      jest
        .spyOn(usersService, 'checkUserAccountEmailExists')
        .mockResolvedValueOnce(false);
      const mockRequest = {
        email: 'John@doe2.com',
        phoneNumber: '+2341111223333',
        otp: '567890',
        password: 'password',
        confirmPassword: 'password',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'male',
        location: 'Lagos, Nigeria',
        customerCategory: 'male',
      };

      const response = await authService.signupAsTailor(mockRequest);
      expect(response).toHaveProperty('tailor');
      expect(response).toHaveProperty('accessToken');
    });
  });

  describe('signupAsOutfitBuyer()', () => {
    it('should return an Outfit Buyer upon successful creation', async () => {
      jest
        .spyOn(usersService, 'checkUserAccountEmailExists')
        .mockResolvedValueOnce(false);
      jest
        .spyOn(usersService, 'checkUserAccountPhoneNumberExists')
        .mockResolvedValueOnce(false);
      const mockRequest = {
        email: 'John@doe3.com',
        phoneNumber: '+2341111223333',
        otp: '567890',
        password: 'password',
        confirmPassword: 'password',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'male',
        location: 'Lagos, Nigeria',
        customerCategory: 'male',
      };
      const response = await authService.signupAsOutfitBuyer(mockRequest);
      expect(response).toHaveProperty('accessToken');
    });
  });

  describe('loginWithPhoneNumber()', () => {
    it('should generate 6 digit numeric otp code', async () => {
      const response = authService.generateOtp();

      expect(response.toString()).toHaveLength(4);
    });
  });

  describe('loginWithEmail()', () => {
    it('should generate 6 digit numeric otp code', async () => {
      const response = authService.generateOtp();

      expect(response.toString()).toHaveLength(4);
    });
  });

  describe('sendSignupOtp()', () => {
    it('should generate 6 digit numeric otp code', async () => {
      const response = authService.generateOtp();

      expect(response.toString()).toHaveLength(4);
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
    mongoose.disconnect();
    mongoose.connection.close();
  });
});

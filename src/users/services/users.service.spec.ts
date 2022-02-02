import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { EmbroidererSignupDto } from 'src/auth/dtos/embroiderer.signup.dto';
import { FabricSellerSignupDto } from 'src/auth/dtos/fabric-seller.signup.dto';
import { OutfitBuyerSignupDto } from 'src/auth/dtos/outfit-buyer.signup.dto';
import { TailorSignupDto } from 'src/auth/dtos/tailor.signup.dto';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../utils/tests/mongoMock';
import { EmbroidererSchema } from '../models/embroiderer.schema';
import { FabricSellerSchema } from '../models/fabric-seller.schema';
import { FeatureRequestSchema } from '../models/feature-request.schema';
import {
  OutfitBuyerDocument,
  OutfitBuyerSchema,
} from '../models/outfit-buyer.schema';
import { userRoles } from '../models/roles.enum';
import { TailorSchema } from '../models/tailor.schema';
import {
  UserAccountDocument,
  UserAccountSchema,
} from '../models/user-account.schema';
import {
  embroidererStub,
  fabricSellerStub,
  outfitBuyerStub,
  tailorStub,
  userAccountStub,
} from '../__stubs__/modelStubs';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let userAccountModel: Model<UserAccountDocument>;
  // let outfitBuyerModel: Model<OutfitBuyerDocument>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'UserAccount', schema: UserAccountSchema },
          { name: 'Tailor', schema: TailorSchema },
          { name: 'FabricSeller', schema: FabricSellerSchema },
          { name: 'OutfitBuyer', schema: OutfitBuyerSchema },
          { name: 'Embroiderer', schema: EmbroidererSchema },
          { name: 'FeatureRequest', schema: FeatureRequestSchema },
        ]),
      ],
      providers: [UsersService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userAccountModel =
      module.get<Model<UserAccountDocument>>('UserAccountModel');

    // outfitBuyerModel = module.get<Model<OutfitBuyerDocument>>("OutfitBuyer");
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('getUserAccountById()', () => {
    it('should validate account by id if valid', async () => {
      const id = '611139689a816ac995c802fd';
      let response;
      jest.spyOn(userAccountModel, 'findById');
      await userAccountModel.create(userAccountStub());
      response = await usersService.getUserAccountById(id);
      expect(userAccountModel.findById).toBeCalledWith(id);
      expect(userAccountModel.findById).toHaveBeenCalledTimes(1);
    });

    it('return null if credentials are invalid', async () => {
      const res = await usersService.getUserAccountById(
        '611139689a816ac995c802fe',
      );
      expect(res).toEqual(null);
    });
    // it("then it should call UserAccountModel", () => {});
    // test("response should have keys greater than 0", () => {});
    // test("userAccount model should be called only once ", () => {});
    // test("return null if id is invalid", async () => {});
  });

  describe('getUserAccountByEmail()', () => {
    const email = userAccountStub().email;
    let response;
    it('validate user account by email if valid', async () => {
      jest.spyOn(userAccountModel, 'findOne');
      response = await usersService.getUserAccountByEmail(email);
      expect(userAccountModel.findOne).toBeCalledWith({ email });
      expect(Object.keys(response).length).toBeGreaterThan(0);
      expect(userAccountModel.findOne).toHaveBeenCalledTimes(1);
    });
    it('return null if email is invalid', async () => {
      const res = await usersService.getUserAccountByEmail('uueu');
      expect(res).toEqual(null);
    });
  });

  describe('getUserAccountByPhoneNumber()', () => {
    it('should get user account if phone no is valid', async () => {
      const phoneNumber = userAccountStub().phoneNumber;
      let response;
      jest.spyOn(userAccountModel, 'findOne');

      response = await usersService.getUserAccountByPhoneNumber(phoneNumber);
      expect(userAccountModel.findOne).toBeCalledWith({ phoneNumber });
      expect(Object.keys(response).length).toBeGreaterThan(0);
    });

    it('return null if phone no is invalid', async () => {
      const res = await usersService.getUserAccountByPhoneNumber('+8488484');
      expect(res).toEqual(null);
    });
  });

  describe('createEmbroiderer()', () => {
    it('create embroidery account test', async () => {
      let response;
      let embroiderersignUpDto: EmbroidererSignupDto;
      embroiderersignUpDto = {
        firstName: embroidererStub().userAccount.firstName,
        lastName: embroidererStub().userAccount.lastName,
        email: 'test2@test.com',
        phoneNumber: '+2348102022543',
        otp: '1234',
        gender: embroidererStub().userAccount.gender,
        password: embroidererStub().userAccount.password,
        confirmPassword: embroidererStub().userAccount.password,
        location: embroidererStub().location,
      };
      jest.spyOn(usersService, 'createUserAccount');

      response = await usersService.createEmbroiderer(embroiderersignUpDto);
      expect(usersService.createUserAccount).toHaveBeenCalledWith(
        { ...embroiderersignUpDto, role: [userRoles.Embroiderer] },
        true,
      );
      expect(response.userAccount.role).toContain('embroiderer');
      expect(usersService.createUserAccount).toHaveBeenCalledTimes(1);
      expect(response).toHaveProperty('userAccount');
    });
  });

  describe('createFabricSeller()', () => {
    it('createFabricSeller() ', async () => {
      let response;
      let fabricSellerSignupDto: FabricSellerSignupDto;
      fabricSellerSignupDto = {
        firstName: fabricSellerStub().userAccount.firstName,
        lastName: fabricSellerStub().userAccount.lastName,

        email: 'test3@test.com',
        phoneNumber: '+2348102022542',
        otp: '1234',
        gender: fabricSellerStub().userAccount.gender,
        password: fabricSellerStub().userAccount.password,
        confirmPassword: fabricSellerStub().userAccount.password,
        location: fabricSellerStub().location,
        customerCategory: fabricSellerStub().customerCategory,
      };
      jest.spyOn(usersService, 'createUserAccount');

      response = await usersService.createFabricSeller(fabricSellerSignupDto);
      expect(usersService.createUserAccount).toHaveBeenLastCalledWith(
        {
          ...fabricSellerSignupDto,
          role: [userRoles.FabricSeller],
        },
        true,
      );
      expect(response.userAccount.role).toContain('fabric-seller');

      expect(response).toHaveProperty('userAccount');
    });
  });

  describe('createOutfitBuyer()', () => {
    it('createOutfitBuyer account', async () => {
      let response;
      let outfitBuyerSignupDto: OutfitBuyerSignupDto;
      outfitBuyerSignupDto = {
        firstName: outfitBuyerStub().userAccount.firstName,
        lastName: outfitBuyerStub().userAccount.lastName,
        email: 'test4@test.com',
        phoneNumber: '+2348102022546',
        gender: outfitBuyerStub().userAccount.gender,
        password: outfitBuyerStub().userAccount.password,
        confirmPassword: outfitBuyerStub().userAccount.password,
        location: outfitBuyerStub().userAccount.location,
      };
      jest.spyOn(usersService, 'createUserAccount');

      response = await usersService.createOutfitBuyer(outfitBuyerSignupDto);
      expect(usersService.createUserAccount).toHaveBeenLastCalledWith(
        {
          ...outfitBuyerSignupDto,
          role: [userRoles.OutfitBuyer],
        },
        false,
      );
      expect(response.userAccount.role).toContain('outfit-buyer');
      expect(response).toHaveProperty('userAccount');
    });
  });

  describe('createTailor()', () => {
    it('create tailor account profile', async () => {
      let response;
      let tailorSignupDto: TailorSignupDto;
      tailorSignupDto = {
        firstName: tailorStub().userAccount.firstName,
        lastName: tailorStub().userAccount.lastName,
        email: 'test6@test.com',
        phoneNumber: '+2348103022542',
        otp: '1234',
        gender: tailorStub().userAccount.gender,
        password: tailorStub().userAccount.password,
        confirmPassword: tailorStub().userAccount.password,
        location: tailorStub().location,
        customerCategory: tailorStub().customerCategory,
      };
      jest.spyOn(usersService, 'createUserAccount');

      response = await usersService.createTailor(tailorSignupDto);
      expect(usersService.createUserAccount).toHaveBeenLastCalledWith(
        {
          ...tailorSignupDto,
          role: [userRoles.Tailor],
        },
        true,
      );
      expect(response.userAccount.role).toContain('tailor');
      expect(response).toHaveProperty('userAccount');
    });
  });

  describe('checkUserAccountEmailExists()', () => {
    it('return user account if email exist', async () => {
      let response;
      let email;
      email = userAccountStub().email;
      jest.spyOn(usersService, 'getUserAccountByEmail');
      jest.spyOn(userAccountModel, 'findOne');
      response = await usersService.checkUserAccountEmailExists(email);
      expect(usersService.getUserAccountByEmail).toHaveBeenLastCalledWith(
        email,
      );
      expect(userAccountModel.findOne).toBeCalledWith({ email });
      expect(usersService.getUserAccountByEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('checkUserAccountPhoneNumberExists()', () => {
    it('checkUserAccountPhoneNumberExists ', async () => {
      let response;
      let phoneNumber;
      phoneNumber = userAccountStub().email;
      jest.spyOn(usersService, 'getUserAccountByPhoneNumber');
      jest.spyOn(userAccountModel, 'findOne');
      response = await usersService.checkUserAccountPhoneNumberExists(
        phoneNumber,
      );
      expect(usersService.getUserAccountByPhoneNumber).toHaveBeenLastCalledWith(
        phoneNumber,
      );
      expect(userAccountModel.findOne).toBeCalledWith({ phoneNumber });
      expect(usersService.getUserAccountByPhoneNumber).toHaveBeenCalledTimes(1);
    });
  });

  // describe("getOutfitBuyerProfile()", () => {
  //   let response;
  //   let user;
  //   beforeEach(async () => {
  //     jest.spyOn(usersService, "getUserAccountByPhoneNumber");
  //     jest.spyOn(outfitBuyerModel, "findOne");
  //     // response = await usersService.checkUserAccountPhoneNumberExists(
  //     //   phoneNumber
  //     // );
  //   });
  //   // phoneNumber = userAccountStub().email;
  //   // test("then it should call getUserAccountByPhoneNumber()", () => {
  //   //   expect(usersService.getUserAccountByPhoneNumber).toHaveBeenLastCalledWith(
  //   //     phoneNumber
  //   //   );
  //   // });
  //   // test("then it should call UserAccountModel", () => {
  //   //   expect(userAccountModel.findOne).toBeCalledWith({ phoneNumber });
  //   // });

  //   // test("to return true if email exist", () => {
  //   //   expect(response).toEqual(true);
  //   // });

  //   // test("then it should call getUserAccountByPhoneNumber() only once", () => {
  //   //   expect(usersService.getUserAccountByPhoneNumber).toHaveBeenCalledTimes(1);
  //   // });
  // });

  afterAll(async () => {
    await closeInMongodConnection();
    await mongoose.disconnect();
    await mongoose.connection.close();
  });
});

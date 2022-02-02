import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { json } from 'express';
import { any } from 'joi';
import { Model } from 'mongoose';
import { TailorSignupPasswordDto } from 'src/auth/dtos/tailor-signup-password.dto';
import { TailorSignupDto } from 'src/auth/dtos/tailor.signup.dto';
import { EmbroidererSignupDto } from '../../auth/dtos/embroiderer.signup.dto';
import { FabricSellerSignupDto } from '../../auth/dtos/fabric-seller.signup.dto';
import { OutfitBuyerSignupDto } from '../../auth/dtos/outfit-buyer.signup.dto';
import { FeatureRequestDto } from '../dtos/feature-request-dto';
import { FeatureRequestResponseDto } from '../dtos/feature-request-response-dto';
import { Embroiderer, EmbroidererDocument } from '../models/embroiderer.schema';
import {
  FabricSeller,
  FabricSellerDocument,
} from '../models/fabric-seller.schema';
import {
  FeatureRequest,
  FeatureRequestDocument,
} from '../models/feature-request.schema';
import {
  OutfitBuyer,
  OutfitBuyerDocument,
} from '../models/outfit-buyer.schema';
import { userRoles } from '../models/roles.enum';
import { Tailor, TailorDocument } from '../models/tailor.schema';
import {
  UserAccount,
  UserAccountDocument,
} from '../models/user-account.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserAccount.name)
    private UserAccountModel: Model<UserAccountDocument>,
    @InjectModel(Tailor.name) private TailorModel: Model<TailorDocument>,
    @InjectModel(OutfitBuyer.name)
    private OutfitBuyerModel: Model<OutfitBuyerDocument>,
    @InjectModel(Embroiderer.name)
    private EmbroidererModel: Model<EmbroidererDocument>,
    @InjectModel(FabricSeller.name)
    private FabricSellerModel: Model<FabricSellerDocument>,
    @InjectModel(FeatureRequest.name)
    private FeatureRequestModel: Model<FeatureRequestDocument>,
  ) {}

  async getUserAccountById(id: string): Promise<UserAccountDocument> {
    return this.UserAccountModel.findById(id);
  }

  async getUserAccountByEmail(email: string): Promise<UserAccountDocument> {
    return this.UserAccountModel.findOne({ email });
  }

  async getUserAccountByPhoneNumber(
    phoneNumber: string,
  ): Promise<UserAccountDocument> {
    return this.UserAccountModel.findOne({ phoneNumber });
  }

  async getUserAccountPassword(email: string): Promise<string> {
    return (
      await this.UserAccountModel.findOne({ email }, { password: 1 }).exec()
    ).password;
  }

  async createEmbroiderer(
    embroidererSignupDto: EmbroidererSignupDto,
  ): Promise<Embroiderer> {
    const newUserAccount: UserAccount = await this.createUserAccount(
      { ...embroidererSignupDto, role: [userRoles.Embroiderer] },
      true,
    );
    let newEmbroidererAccount: any = {
      location: embroidererSignupDto.location,
      userAccount: newUserAccount,
    };
    newEmbroidererAccount = new this.EmbroidererModel(newEmbroidererAccount);
    return newEmbroidererAccount.save();
  }

  async createFabricSeller(
    fabricSellerSignupDto: FabricSellerSignupDto,
  ): Promise<FabricSeller> {
    const newUserAccount: UserAccount = await this.createUserAccount(
      { ...fabricSellerSignupDto, role: [userRoles.FabricSeller] },
      true,
    );
    let newFabricSellerAccount: any = {
      location: fabricSellerSignupDto.location,
      userAccount: newUserAccount,
      customerCategory: fabricSellerSignupDto.customerCategory,
    };
    newFabricSellerAccount = new this.FabricSellerModel(newFabricSellerAccount);

    return newFabricSellerAccount.save();
  }

  async createOutfitBuyer(
    outfitBuyerSignupDto: OutfitBuyerSignupDto,
  ): Promise<OutfitBuyer> {
    const newUserAccount: UserAccount = await this.createUserAccount(
      { ...outfitBuyerSignupDto, role: [userRoles.OutfitBuyer] },
      false,
    );
    let newOutfitBuyerAccount: any = {
      userAccount: newUserAccount,
    };
    newOutfitBuyerAccount = new this.OutfitBuyerModel(newOutfitBuyerAccount);
    return newOutfitBuyerAccount.save();
  }

  async createTailor(tailorSignupDto: TailorSignupDto): Promise<Tailor> {
    const newUserAccount: UserAccount = await this.createUserAccount(
      { ...tailorSignupDto, role: [userRoles.Tailor] },
      true,
    );
    let newTailorAccount: any = {
      location: tailorSignupDto.location,
      customerCategory: tailorSignupDto.customerCategory,
      userAccount: newUserAccount,
    };
    newTailorAccount = new this.TailorModel(newTailorAccount);
    return newTailorAccount.save();
  }

  async createTailorPassword(
    tailorsignuppasswordDto: TailorSignupPasswordDto,
  ): Promise<Tailor> {
    const newUserAccount: UserAccount = await this.createUserAccount(
      { ...tailorsignuppasswordDto, role: [userRoles.Tailor] },
      true,
    );
    let newTailorAccount: any = {
      location: tailorsignuppasswordDto.location,
      customerCategory: tailorsignuppasswordDto.customerCategory,
      userAccount: newUserAccount,
    };
    newTailorAccount = new this.TailorModel(newTailorAccount);
    return newTailorAccount.save();
  }

  async checkUserAccountEmailExists(email: string): Promise<boolean> {
    const user = await this.getUserAccountByEmail(email);
    if (user) return true;
    return false;
  }

  async checkUserAccountPhoneNumberExists(
    phoneNumber: string,
  ): Promise<boolean> {
    const user = await this.getUserAccountByPhoneNumber(phoneNumber);
    if (user) return true;
    return false;
  }

  async createUserAccount(
    profileDto: any,
    isConfirmed: boolean,
  ): Promise<UserAccount> {
    const newUserAccount = {
      firstName: profileDto.firstName,
      lastName: profileDto.lastName,
      email: profileDto.email,
      password: profileDto.password,
      phoneNumber: profileDto.phoneNumber,
      gender: profileDto.gender,
      role: profileDto.role,
    };

    if (profileDto.password) {
      const saltOrRounds = 10;
      newUserAccount.password = await bcrypt.hash(
        newUserAccount.password,
        saltOrRounds,
      );
    }
    const createdUserAccount = new this.UserAccountModel(newUserAccount);
    createdUserAccount.isConfirmed = isConfirmed;
    return createdUserAccount.save();
  }

  async getOutfitBuyerProfile(user: any): Promise<OutfitBuyer> {
    return this.OutfitBuyerModel.findOne({ userAccount: user }).exec();
  }

  async searchOutfitBuyers(
    email: string,
    phoneNumber: string,
    skip: number,
    limit: number,
  ): Promise<UserAccount[]> {
    const queryObj: any = {
      role: userRoles.OutfitBuyer,
    };
    if (email && email.length > 1) {
      queryObj.email = { $regex: email, $options: 'i' };
    }

    if (phoneNumber && phoneNumber.length > 1) {
      queryObj.phoneNumber = { $regex: phoneNumber, $options: 'i' };
    }

    return this.UserAccountModel.find(queryObj).skip(skip).limit(limit).exec();
  }

  async searchTailors(
    email: string,
    phoneNumber: string,
    skip: number,
    limit: number,
  ): Promise<UserAccount[]> {
    const queryObj: any = {
      role: userRoles.Tailor,
    };
    if (email && email.length > 1) {
      queryObj.email = { $regex: email, $options: 'i' };
    }

    if (phoneNumber && phoneNumber.length > 1) {
      queryObj.phoneNumber = { $regex: phoneNumber, $options: 'i' };
    }

    return this.UserAccountModel.find(queryObj).skip(skip).limit(limit).exec();
  }
  async requestFeature(
    featureRequest: FeatureRequestDto,
    user: UserAccount,
  ): Promise<FeatureRequestResponseDto> {
    const previouslyRequestedFeature = this.FeatureRequestModel.find({
      email: user.email,
      feature: featureRequest.feature,
    });
    if (previouslyRequestedFeature) {
      return {
        status: 'ok',
        message:
          'You have been subscribed to future updates for the release of this feature',
      };
    }

    const featureRequestObj: any = {
      name: `${user.firstName} ${user.lastName}`,
      email: `${user.email}`,
      phoneNumber: `${user.phoneNumber}`,
      feature: `${featureRequest.feature}`,
      userId: user.id,
    };

    const newFeatureRequest = new this.FeatureRequestModel(featureRequestObj);
    await newFeatureRequest.save();
    return {
      status: 'ok',
      message:
        'You have been subscribed to future updates for the release of this feature',
    };
  }

  async checkEmailAndPhone(email: string, phone: string): Promise<any> {
    const CheckEmail: UserAccount = await this.getUserAccountByEmail(email);
    const CheckPhone: UserAccount = await this.getUserAccountByPhoneNumber(
      phone,
    );
    console.log(CheckEmail);
    console.log(CheckPhone);
    if (CheckEmail || CheckPhone) {
      if (JSON.stringify(CheckEmail) !== JSON.stringify(CheckPhone)) {
        throw new BadRequestException(
          'Email address or phone Number is linked with another account',
        );
      }
    }
  }

  async updateRole(email: string, role: string): Promise<any> {
    const user: UserAccount = await this.UserAccountModel.findOneAndUpdate(
      { email },
      { $push: { role } },
    ).exec();

    return user;
  }
}

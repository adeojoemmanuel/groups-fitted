import * as moment from 'moment';
import * as mongoose from 'mongoose';
import { OtpVerification } from '../../auth/models/phoneVerification.model';
import { config } from '../../config/index';
import { Embroiderer } from '../models/embroiderer.schema';
import { FabricSeller } from '../models/fabric-seller.schema';
import { OutfitBuyer } from '../models/outfit-buyer.schema';
import { userRoles } from '../models/roles.enum';
import { Tailor } from '../models/tailor.schema';
import { UserAccount } from '../models/user-account.schema';

export const userAccountStub = (): UserAccount => {
  const userAccount = {
    id: '6113e9f2f952ca3da2f89a1c', // mongoose.Types.ObjectId().toString(),
    firstName: 'John',
    lastName: 'Doe',
    email: 'davieedpopoola@gmail.com',
    password: 'testPassword',
    phoneNumber: '+2347041538969',
    isConfirmed: true,
    gender: 'male',
    tailorProfile: null,
    outfitBuyerProfile: null,
    fabricSellerProfile: null,
    embroidererProfile: null,
    role: [],
  };
  return new UserAccount(userAccount);
};

export const otpVerificationStub = (): OtpVerification => {
  const otpVerification = {
    otpCode: '1234',
    phoneNumber: '+2347041538969',
    expires: moment().add(config.otpTtl, 'seconds').toDate(),
  };
  return new OtpVerification(otpVerification);
};

export const outfitBuyerStub = (): OutfitBuyer => {
  return {
    id: '6113e9f3f952ca3da2f89a24', // mongoose.Types.ObjectId().toString(),
    userAccount: userAccountStub(),
    measurements: [],
  };
};

export const tailorStub = (): Tailor => {
  return {
    userAccount: userAccountStub(),
    location: 'Lagos, Nigeria',
    customerCategory: 'male',
  };
};

export const fabricSellerStub = (): FabricSeller => {
  return {
    userAccount: userAccountStub(),
    location: 'Lagos, Nigeria',
    customerCategory: 'male',
  };
};

export const embroidererStub = (): Embroiderer => {
  return {
    userAccount: userAccountStub(),
    location: 'Lagos, Nigeria',
  };
};

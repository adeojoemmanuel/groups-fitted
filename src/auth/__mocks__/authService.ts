import {
  embroidererStub,
  fabricSellerStub,
  outfitBuyerStub,
  tailorStub,
  userAccountStub,
} from '../../users/__stubs__/modelStubs';

const loginResponse = {
  accessToken: 'sadsadasdsdsa',
  user: userAccountStub(),
};

export const MockAuthService = {
  confirmEmail: jest.fn().mockResolvedValue(true),
  resetPasswordWithRecoveryCode: jest.fn().mockResolvedValue(true),
  recoverPassword: jest.fn().mockResolvedValue(true),
  resetPassword: jest.fn().mockResolvedValue(true),
  resendSignupOtp: jest.fn().mockResolvedValue(true),
  sendSignupOtp: jest.fn().mockResolvedValue(true),
  loginWithPhoneNumber: jest.fn().mockResolvedValue(loginResponse),
  loginWithEmail: jest.fn().mockResolvedValue(loginResponse),
  signupAsOutfitBuyer: jest.fn().mockResolvedValue(outfitBuyerStub()),
  signupAsTailor: jest.fn().mockResolvedValue(tailorStub()),
  signupAsFabricSeller: jest.fn().mockResolvedValue(fabricSellerStub()),
  signupAsEmbroiderer: jest.fn().mockResolvedValue(embroidererStub()),
  generateOtp: jest.fn().mockReturnValue(123456),
  validate: jest.fn().mockResolvedValue(userAccountStub()),
  verifyOtp: jest.fn().mockResolvedValue(true),
};

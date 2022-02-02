import {
  embroidererStub,
  fabricSellerStub,
  outfitBuyerStub,
  tailorStub,
  userAccountStub,
} from '../../users/__stubs__/modelStubs';

export const MockUsersService = {
  getUserAccountById: jest.fn().mockResolvedValue(userAccountStub()),
  getUserAccountByEmail: jest.fn().mockResolvedValue(userAccountStub()),
  getUserAccountByPhoneNumber: jest.fn().mockResolvedValue(userAccountStub()),
  createEmbroiderer: jest.fn().mockResolvedValue(embroidererStub()),
  createFabricSeller: jest.fn().mockResolvedValue(fabricSellerStub()),
  createOutfitBuyer: jest.fn().mockResolvedValue(outfitBuyerStub()),
  createTailor: jest.fn().mockResolvedValue(tailorStub()),
  createUserAccount: jest.fn().mockResolvedValue(userAccountStub()),
  checkUserAccountEmailExists: jest.fn().mockResolvedValue(false),
  checkUserAccountPhoneNumberExists: jest.fn().mockResolvedValue(false),
  getOutfitBuyerProfile: jest.fn().mockResolvedValue(outfitBuyerStub()),
};

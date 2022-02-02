import { userAccountStub } from '../../users/__stubs__/modelStubs';
export function mockUserAccountModel(dto: any): void {
  this.data = dto;
  this.findById = (id: string) => {
    return userAccountStub;
  };
  this.save = () => {
    return this.data;
  };
}

export function mockOutfitBuyerModel(dto: any): void {
  this.data = dto;
  this.save = () => {
    return this.data;
  };
}

export function mockTailorModel(dto: any): void {
  this.data = dto;
  this.save = () => {
    return this.data;
  };
}

export function mockFabricSellerModel(dto: any): void {
  this.data = dto;
  this.save = () => {
    return this.data;
  };
}

export function mockEmbroidererModel(dto: any): void {
  this.data = dto;
  this.save = () => {
    return this.data;
  };
}

export function mockUserModel1(dto: any): void {
  this.data = dto;
  this.save = () => {
    return this.data;
  };
}

export function mockUserModel2(dto: any): void {
  this.data = dto;
  this.save = () => {
    return this.data;
  };
}

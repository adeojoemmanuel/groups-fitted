import { OutfitBuyerSignupDto } from '../../auth/dtos/outfit-buyer.signup.dto';

export const outfitBuyerSignupDtoSub = (): OutfitBuyerSignupDto => {
  const signupDto = {
    email: 'davieedpopoola@gmail.com',
    phoneNumber: '+2341111223333',
    otp: '567890',
    password: 'password',
    confirmPassword: 'password',
    firstName: 'John',
    lastName: 'Doe',
    gender: 'male',
    location: 'Lagos, Nigeria',
  };
  return new OutfitBuyerSignupDto(signupDto);
};

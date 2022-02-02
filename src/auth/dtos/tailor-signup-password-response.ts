import { Tailor } from 'src/users/models/tailor.schema';

export class TailorSignupPasswordResponseDto {
  accessToken: string;
  tailor: Tailor;
}

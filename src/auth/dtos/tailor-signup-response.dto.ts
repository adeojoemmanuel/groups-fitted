import { Tailor } from '../../users/models/tailor.schema';
export class TailorSignupResponseDto {
  accessToken: string;
  tailor: Tailor;
}

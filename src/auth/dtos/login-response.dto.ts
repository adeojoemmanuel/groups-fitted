import { UserAccount } from '../../users/models/user-account.schema';
export class LoginResponseDto {
  accessToken: string;
  user: UserAccount;
}

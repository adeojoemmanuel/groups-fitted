import { UserAccount } from 'src/users/models/user-account.schema';

export class TailorProfileDto {
  status: string;
  user: UserAccount;
}

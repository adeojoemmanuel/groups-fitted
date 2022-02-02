import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Tailor, TailorSchema } from 'src/users/models/tailor.schema';
import { config } from '../config';
import {
  UserAccount,
  UserAccountSchema,
} from '../users/models/user-account.schema';
import { UsersModule } from '../users/users.module';
import { MailingModule } from '../utils/mailing/mailing.module';
import { MessagingModule } from '../utils/messaging/messaging.module';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './guards/jwt.strategy';
import { LocalStrategy } from './guards/local.strategy';
import {
  EmailVerification,
  EmailVerificationSchema,
} from './models/emailVerification.model';
import {
  PasswordRecovery,
  PasswordRecoverySchema,
} from './models/password-recovery.model';
import {
  OtpVerification,
  OtpVerificationSchema,
} from './models/phoneVerification.model';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: config.secret,
      signOptions: {
        expiresIn: 86400, // 1 week
      },
    }),
    MongooseModule.forFeature([
      { name: OtpVerification.name, schema: OtpVerificationSchema },
      { name: EmailVerification.name, schema: EmailVerificationSchema },
      { name: PasswordRecovery.name, schema: PasswordRecoverySchema },
      { name: Tailor.name, schema: TailorSchema },
      { name: UserAccount.name, schema: UserAccountSchema },
    ]),
    MessagingModule,
    MailingModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}

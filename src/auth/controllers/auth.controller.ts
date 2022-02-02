import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Embroiderer } from 'src/users/models/embroiderer.schema';
import { OutfitBuyer } from 'src/users/models/outfit-buyer.schema';
import { FabricSeller } from '../../users/models/fabric-seller.schema';
import { Tailor } from '../../users/models/tailor.schema';
import { UserAccount } from '../../users/models/user-account.schema';
import { LoggedInUser } from '../../utils/decorators/current-user.decorator';
import { EmailLoginDto } from '../dtos/email-login.dto';
import { EmbroidererSignupDto } from '../dtos/embroiderer.signup.dto';
import { FabricSellerSignupDto } from '../dtos/fabric-seller.signup.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { OutfitBuyerSignupResponseDto } from '../dtos/outfit-buyer-signup-response.dto';
import { OutfitBuyerSignupDto } from '../dtos/outfit-buyer.signup.dto';
import { PasswordResetWithCodeDto } from '../dtos/password-reset-with-code.dto';
import { PasswordResetDto } from '../dtos/password-reset.dto';
import { PasswordlessLoginDto } from '../dtos/passwordless-login.dto';
import { PhoneNumberLoginDto } from '../dtos/phoneNumber-login.dto';
import { RequestOtpDto } from '../dtos/request-otp.dto';
import { TailorSignupPasswordResponseDto } from '../dtos/tailor-signup-password-response';
import { TailorSignupPasswordDto } from '../dtos/tailor-signup-password.dto';
import { TailorSignupResponseDto } from '../dtos/tailor-signup-response.dto';
import { TailorSignupDto } from '../dtos/tailor.signup.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { OtpVerification } from '../models/phoneVerification.model';
import { AuthService } from '../services/auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login-phone')
  async loginWithPhoneNumber(
    @Body() loginDto: PhoneNumberLoginDto,
  ): Promise<LoginResponseDto> {
    return this.authService.loginWithPhoneNumber(loginDto);
  }

  @Post('/login-email')
  async loginWithEmail(
    @Body() loginDto: EmailLoginDto,
  ): Promise<LoginResponseDto> {
    return this.authService.loginWithEmail(loginDto);
  }

  @Post('/tailor/signup')
  async tailorSignup(
    @Body() tailorSignupDto: TailorSignupDto,
  ): Promise<TailorSignupResponseDto> {
    return this.authService.signupAsTailor(tailorSignupDto);
  }

  @Post('/fabric-seller/signup')
  async fabricSellerSignup(
    @Body() fabricSellerSignupDto: FabricSellerSignupDto,
  ): Promise<FabricSeller> {
    return this.authService.signupAsFabricSeller(fabricSellerSignupDto);
  }

  @Post('/outfit-buyer/signup')
  async outfitBuyerSignup(
    @Body() outfitBuyerSignupDto: OutfitBuyerSignupDto,
  ): Promise<OutfitBuyerSignupResponseDto> {
    return this.authService.signupAsOutfitBuyer(outfitBuyerSignupDto);
  }

  @Post('/tailor/signup-password')
  async tailorSIgnUpPassword(
    @Body() tailorSignUpasswordpDto: TailorSignupPasswordDto,
  ): Promise<TailorSignupPasswordResponseDto> {
    return this.authService.signupAsTailorPassword(tailorSignUpasswordpDto);
  }

  @Post('/embroiderer/signup')
  async embroidererSignup(
    @Body() embroidererSignupDto: EmbroidererSignupDto,
  ): Promise<Embroiderer> {
    return this.authService.signupAsEmbroiderer(embroidererSignupDto);
  }

  // @Post('/send-signup-otp')
  // async sendSignupOTP(@Body() otpDto: RequestOtpDto): Promise<boolean> {
  //   return this.authService.sendSignupOtp(otpDto);
  // }

  @Post('/resend-signup-otp')
  async resendSignupOTP(@Body() otpDto: RequestOtpDto): Promise<boolean> {
    return this.authService.resendSignupOtp(otpDto);
  }

  @Post('/passwordless-login')
  async passwordlessLogin(
    @Body() loginDto: PasswordlessLoginDto,
  ): Promise<LoginResponseDto> {
    return this.authService.passwordlessLogin(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  async resendEmailConfirmation(@Query() email: string): Promise<string> {
    return this.authService.sendConfirmationEmail(email);
  }

  async confirmEmail(
    @Query() confirmationCode: string,
    @Query() email: string,
  ): Promise<boolean> {
    return this.authService.confirmEmail(confirmationCode, email);
  }

  @UseGuards(JwtAuthGuard)
  async resetPassword(
    @LoggedInUser() user: UserAccount,
    @Body() passwordResetDto: PasswordResetDto,
  ): Promise<void> {
    return this.authService.resetPassword(user, passwordResetDto);
  }

  @Post('/recover-password-with-code')
  async resetPasswordWithVerificationCode(
    @Body() passwordResetWithCodeDto: PasswordResetWithCodeDto,
  ): Promise<boolean> {
    return this.authService.resetPasswordWithRecoveryCode(
      passwordResetWithCodeDto,
    );
  }

  @Post('/recover-password')
  async recoverPassword(@Query('email') email: string): Promise<boolean> {
    return this.authService.recoverPassword(email);
  }

  @Post('/verify-email')
  async verifyEmail(
    @Query('confirmationCode') confirmationCode: string,
  ): Promise<boolean> {
    return this.authService.verifyEmail(confirmationCode);
  }
}

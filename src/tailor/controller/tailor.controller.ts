import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { userRoles } from 'src/users/models/roles.enum';
import { UserAccount } from 'src/users/models/user-account.schema';
import { LoggedInUser } from 'src/utils/decorators/current-user.decorator';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { AddTailorResponseDto } from '../dto/add-tailor-response.dto';
import { AddTailorDto } from '../dto/add-tailor.dto';
import { DownloadMeasurementResponseDto } from '../dto/download-measurement-response.dto';
import { DownloadMeasurementDto } from '../dto/download-measurment.dto';
import { FetchInviteeResponseDto } from '../dto/fetch-invitee-response.dto';
import { FetchInviteeDto } from '../dto/fetch-invitee.dto';
import { MeasurementFavouriteResponseDto } from '../dto/measurement-favourite-response.dto';
import { MeasurementFavouriteDto } from '../dto/measurement-favourite.dto';
import { TailorMeasurementResponseDto } from '../dto/tailor-measurements-response.dto';
import { TailorProfileDto } from '../dto/tailor.profile.dto';
import { TailorService } from '../service/tailor.service';

@Controller('tailor')
@ApiTags('Tailors')
export class TailorController {
  constructor(private readonly tailorService: TailorService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(userRoles.OutfitBuyer)
  @UsePipes(ValidationPipe)
  @Post('/send-tailor-measurements')
  @ApiBearerAuth()
  addTailor(
    @Body() addTailorDto: AddTailorDto,
    @LoggedInUser() user: UserAccount,
  ): Promise<AddTailorResponseDto> {
    return this.tailorService.addTailor(addTailorDto, user);
  }

  @UsePipes(ValidationPipe)
  @Post('/fetch-invitee')
  fetchInvitee(
    @Body() fetchInviteeDto: FetchInviteeDto,
  ): Promise<FetchInviteeResponseDto> {
    return this.tailorService.fetchInvitee(fetchInviteeDto);
  }

  @ApiBearerAuth()
  @Roles(userRoles.Tailor)
  @UseGuards(JwtAuthGuard)
  @Get('/measurements')
  getMeasurements(
    @LoggedInUser() user: UserAccount,
  ): Promise<TailorMeasurementResponseDto> {
    return this.tailorService.getTailorMeasurements(user);
  }

  @ApiBearerAuth()
  @Roles(userRoles.Tailor)
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@LoggedInUser() user: UserAccount): Promise<TailorProfileDto> {
    return this.tailorService.tailorProfile(user);
  }

  @ApiBearerAuth()
  @Roles(userRoles.Tailor)
  @UseGuards(JwtAuthGuard)
  @Post('/fav-measurement')
  favouriteMeasurement(
    @Body() measurementFavouriteDto: MeasurementFavouriteDto,
    @LoggedInUser() user: UserAccount,
  ): Promise<MeasurementFavouriteResponseDto> {
    return this.tailorService.favouriteMeasurement(
      measurementFavouriteDto,
      user,
    );
  }

  @ApiBearerAuth()
  @Roles(userRoles.Tailor)
  @UseGuards(JwtAuthGuard)
  @Post('/download-measurement')
  downloadMeasurement(
    @Body() downloadMeasurementDto: DownloadMeasurementDto,
    @LoggedInUser() user: UserAccount,
  ): Promise<DownloadMeasurementResponseDto> {
    return this.tailorService.downloadMeasurements(downloadMeasurementDto);
  }
}

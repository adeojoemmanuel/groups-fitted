import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { up } from 'src/migrations/1628628219040-AddRolesToAllUserAccounts';
import { Roles } from '../..//utils/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AddTailorDto } from '../../tailor/dto/add-tailor.dto';
import { userRoles } from '../../users/models/roles.enum';
import { UserAccount } from '../../users/models/user-account.schema';
import { LoggedInUser } from '../../utils/decorators/current-user.decorator';
import { CloneMeasurementDto } from '../dto/clone-measurement.dto';
import { ConfirmAutoSizeDto } from '../dto/confirm-autosize-measurement.dto';
import { AutoSizeDto } from '../dto/create-autosize-measurement.dto';
import { CreateManualMeasurementDto } from '../dto/create-manual-measurement.dto';
import { CreateMeasurementRequestDto } from '../dto/create-measurement-request.dto';
import { EditMeasurementResonseDto } from '../dto/edit-measurement-response.dto';
import { EditMeasurementDto } from '../dto/edit-measurement.dto';
import { SkipAutoSizeMeasurementDto } from '../dto/skip-auto-measurement.dto';
import { Measurement } from '../models/measurement.model';
// import { UpdateMeasurementDto } from '../dto/update-measurement.dto';
import { MeasurementsService } from '../services/measurements.service';

@Controller('measurements')
@UseGuards(JwtAuthGuard)
@Roles(userRoles.OutfitBuyer)
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Post('/add-auto-measurement')
  createAutosizeMeasurement(
    @Body() autoSizeDto: AutoSizeDto,
    @LoggedInUser() user: UserAccount,
  ): Promise<object> {
    return this.measurementsService.createAutoSizeMeasurement(
      autoSizeDto,
      user,
    );
  }

  @Roles(userRoles.OutfitBuyer)
  @Post('/confirm-auto-measurement')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  confirmAutosizeMeasurement(
    @Body() confirmAutoSizeDto: ConfirmAutoSizeDto,
    @LoggedInUser() user: UserAccount,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Measurement> {
    return this.measurementsService.confirmAutosizeMeasurement(
      confirmAutoSizeDto,
      user,
      file,
    );
  }

  @Roles(userRoles.OutfitBuyer)
  @Get('/measurement-history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  getMeasurementHistory(
    @LoggedInUser() user: UserAccount,
  ): Promise<Measurement> {
    return this.measurementsService.getMeasurementHistory(user);
  }

  @Roles(userRoles.OutfitBuyer)
  @Post('/update-measurement')
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateMeasurement(
    @Body() editmeasurementDto: EditMeasurementDto,
  ): Promise<EditMeasurementResonseDto> {
    return this.measurementsService.EditMeasurement(editmeasurementDto);
  }

  @Roles(userRoles.OutfitBuyer)
  @Post('/clone-measurement')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  cloneMeasurement(
    @Body() clonemeasurement: CloneMeasurementDto,
    @LoggedInUser() user: UserAccount,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return this.measurementsService.cloneMeasurement(
      clonemeasurement,
      user,
      file,
    );
  }

  @Roles(userRoles.OutfitBuyer)
  @Post('/create-manual-measurement')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  createManualMeasurement(
    @Body() manualMeasurementDto: CreateManualMeasurementDto,
    @LoggedInUser() user: UserAccount,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Measurement> {
    return this.measurementsService.createManualMeasurement(
      manualMeasurementDto,
      user,
      file,
    );
  }

  @Post('skip-autosize-input')
  skipAutoSizeMeasurement(
    @Body() skipAutoSizeMeasurementDto: SkipAutoSizeMeasurementDto,
    @LoggedInUser() user: UserAccount,
  ): Promise<Measurement> {
    return this.measurementsService.skipAutoSizeMeasurement(
      skipAutoSizeMeasurementDto,
      user,
    );
  }

  @Get('autosize-input')
  getSkippedAutoSizeMeasurement(
    @LoggedInUser() user: UserAccount,
  ): Promise<Measurement> {
    return this.measurementsService.getSkippedAutoSizeMeasurement(user);
  }

  // @Post("/add-tailor")
  // @UseGuards(JwtAuthGuard)
  // addTailor(
  //   @Body() addTailorDto: AddTailorDto,
  //   @LoggedInUser() user: UserAccount
  // ): Promise<boolean> {
  //   return this.measurementsService.addTailor(addTailorDto, user);
  // }
}

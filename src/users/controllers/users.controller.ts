import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OutfitBuyerDetailsDto } from '../../measurements/dto/outfit-buyer-details.dto';
import { LoggedInUser } from '../../utils/decorators/current-user.decorator';
import { Roles } from '../../utils/decorators/roles.decorator';
import { FeatureRequestDto } from '../dtos/feature-request-dto';
import { FeatureRequestResponseDto } from '../dtos/feature-request-response-dto';
import { userRoles } from '../models/roles.enum';
import { UserAccount } from '../models/user-account.schema';
import { UsersService } from '../services/users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
@Roles(userRoles.OutfitBuyer)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/outfitBuyers/search')
  searchOutfitBuyers(
    @Query('email') email: string,
    @Query('phoneNumber') phoneNumber: string,
    @Query('skip') skip: number,
    @Query('limit') limit: number,
  ): Promise<any> {
    return this.usersService.searchOutfitBuyers(
      email,
      phoneNumber,
      skip,
      limit,
    );
  }

  @Get('/tailors/search')
  searchTailors(
    @Query('email') email: string,
    @Query('phoneNumber') phoneNumber: string,
    @Query('skip') skip: number,
    @Query('limit') limit: number,
  ): Promise<any> {
    return this.usersService.searchTailors(email, phoneNumber, skip, limit);
  }

  @UsePipes(ValidationPipe)
  @Post('/feature-request')
  @ApiBearerAuth()
  requestFeature(
    @Body() featureRequestDto: FeatureRequestDto,
    @LoggedInUser() user: UserAccount,
  ): Promise<FeatureRequestResponseDto> {
    return this.usersService.requestFeature(featureRequestDto, user);
  }
}

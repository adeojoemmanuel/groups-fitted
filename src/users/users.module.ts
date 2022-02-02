import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UsersController } from './controllers/users.controller';
import { Embroiderer, EmbroidererSchema } from './models/embroiderer.schema';
import {
  FabricSeller,
  FabricSellerSchema,
} from './models/fabric-seller.schema';
import {
  FeatureRequest,
  FeatureRequestSchema,
} from './models/feature-request.schema';
import { OutfitBuyer, OutfitBuyerSchema } from './models/outfit-buyer.schema';
import { Tailor, TailorSchema } from './models/tailor.schema';
import { UserAccount, UserAccountSchema } from './models/user-account.schema';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserAccount.name, schema: UserAccountSchema },
      { name: OutfitBuyer.name, schema: OutfitBuyerSchema },
      { name: Tailor.name, schema: TailorSchema },
      { name: FabricSeller.name, schema: FabricSellerSchema },
      { name: Embroiderer.name, schema: EmbroidererSchema },
      { name: FeatureRequest.name, schema: FeatureRequestSchema },
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService, MongooseModule],
  controllers: [UsersController],
})
export class UsersModule {}

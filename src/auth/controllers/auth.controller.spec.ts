import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { MockUsersService } from '../__mocks__/usersService';
import { AuthController } from './auth.controller';

describe('UsersController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(MockUsersService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

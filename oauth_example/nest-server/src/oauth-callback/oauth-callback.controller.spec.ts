import { Test, TestingModule } from '@nestjs/testing';
import { OauthCallbackController } from './oauth-callback.controller';

describe('OauthCallbackController', () => {
  let controller: OauthCallbackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OauthCallbackController],
    }).compile();

    controller = module.get<OauthCallbackController>(OauthCallbackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { WebSocketGateway } from './web-socket.gateway';

describe('WebSocketGateway', () => {
  let gateway: WebSocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebSocketGateway],
    }).compile();

    gateway = module.get<WebSocketGateway>(WebSocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

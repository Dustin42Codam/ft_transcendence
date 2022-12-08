import { WebSocketGateways } from './web-socket.gateway';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { io, Socket } from "socket.io-client";
import { expect } from '@jest/globals';

async function createNestApp(...gateways): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    providers: gateways,
  }).compile();
  const app = testingModule.createNestApplication();
  app.useWebSocketAdapter(new WsAdapter(app) as any);
  return app;
}

describe("Testing baisic connections", () => {
	let app: INestApplication;
	let socket: Socket;

	it("Testing simple connection to websocks: ", async () => {
		app = await createNestApp(WebSocketGateways);
		await app.listen(3001);
		socket = io("ws://localhost:3001", { transports: ["websocket", "polling"], autoConnect: false },);

    socket.connect();
		console.log(socket);

		/*
    socket.send(
      JSON.stringify({
        event: 'push',
        data: {
          test: 'test',
        },
      }),
    );
    await new Promise<void>(resolve =>
      socket.on('message', data => {
				console.log("This is data", data);
        expect(JSON.parse(data).data.test).toBe('test');
        socket.close();
        resolve();
      }),
    );
	 */
	});
});

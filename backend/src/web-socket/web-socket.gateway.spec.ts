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
  return app;
}

describe("Testing baisic connections", () => {
	let app: INestApplication;
	let socket: Socket;

	it("Socket connects to server: ", async () => {
		app = await createNestApp(WebSocketGateways);
		await app.listen(3001);
		socket = io("ws://localhost:3001", { transports: ["websocket", "polling"], autoConnect: true },);
	
    await new Promise<void>(resolve =>
			socket.on('connect', () => {
				expect(socket.connected).toBe(true);
        resolve();
      }),
    );
	});

	/*
	it("Socket disconnects from server: ", async () => {
		app = await createNestApp(WebSocketGateways);
		await app.listen(3001);
		socket = io("ws://localhost:3001", { transports: ["websocket", "polling"], autoConnect: true },);
		socket.disconnect();
		socket.close();
	
    await new Promise<void>(resolve =>
			socket.on('disconnect', () => {
				console.log("dicsco dico");
				expect(socket.disconnected).toBe(true);
        resolve();
      }),
    );
	});
 do not know how to test this
 */

	it("Socket send and recives data: ", async () => {
		app = await createNestApp(WebSocketGateways);
		await app.listen(3001);
		socket = io("ws://localhost:3001", { transports: ["websocket", "polling"], autoConnect: true },);
		socket.emit("msgToServer", "test");

    await new Promise<void>(resolve =>
      socket.on("msgToClient", msg => {
        expect(msg).toBe("test");
        resolve();
      }),
    );
	});
	afterEach(() => app.close());
});

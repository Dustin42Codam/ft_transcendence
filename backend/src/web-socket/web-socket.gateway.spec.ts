import { WebSocketGateways } from './web-socket.gateway';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { io, Socket } from "socket.io-client";
import { expect } from '@jest/globals';

function randomString(length:number): string {
    let result: string           = "";
    let characters:string       = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength:number = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

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

	for (let i = 0; i < 20; i++) {
		it("Socket send and recives data: ", async () => {
			let randMsg: string = randomString(Math.random() * 20);
			app = await createNestApp(WebSocketGateways);
			await app.listen(3001);
			socket = io("ws://localhost:3001", { transports: ["websocket", "polling"], autoConnect: true },);
			socket.emit("msgToServer", randMsg);

			await new Promise<void>(resolve =>
				socket.on("msgToClient", msg => {
					expect(msg).toBe(randMsg);
					resolve();
				}),
			);
		});
	}
	it ("send null as arg", async () => {
		app = await createNestApp(WebSocketGateways);
		await app.listen(3001);
		socket = io("ws://localhost:3001", { transports: ["websocket", "polling"], autoConnect: true },);
		socket.emit("msgToServer", null);

		await new Promise<void>(resolve =>
			socket.on("msgToClient", msg => {
				expect(msg).toBe(null);
				resolve();
			}),
		);
	});
	it ("send undefined as arg", async () => {
		app = await createNestApp(WebSocketGateways);
		await app.listen(3001);
		socket = io("ws://localhost:3001", { transports: ["websocket", "polling"], autoConnect: true },);
		socket.emit("msgToServer", undefined);

		await new Promise<void>(resolve =>
			socket.on("msgToClient", msg => {
				expect(msg).toBe(null);
				resolve();
			}),
		);
	});
	afterEach(() => app.close());
});
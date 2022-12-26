import { ChatGateways } from './chat.gateway';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { io, Socket } from "socket.io-client";
import { jest, expect } from '@jest/globals';
import ChatEvent from "./chatEvent";

function randomString(length:number): string {
    let result: string           = "";
    let characters:string       = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength:number = characters.length;
		if (Math.floor(Math.random() * charactersLength) == 10) return null;
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

	let socket: Socket;
	let randMsg: string;

  beforeEach(function(done) {
    socket = io('http://localhost:3001/chat');
    socket.on('connect', function() {
				randMsg = randomString(Math.random() * 20);
        done();
    });
  });

  afterEach(function(done) {
    if(socket.connected) {
        socket.disconnect();
    }
    done();
  });

	//TODO client should not be able to send date if not in a room
	it("Socket send and recives data: ", async () => {
		//TODO these will faill till we fix the room check
		socket.emit(ChatEvent.SendMessageToServer, randMsg);

		await new Promise<void>(resolve =>
			socket.on(ChatEvent.SendMessageToClient, msg => {
				expect(msg).toBe(randMsg);
				resolve();
			}),
		);
	});

	it("Client joins a publick room: ", async () => {

		socket.emit(ChatEvent.JoinChatRoom, { chatRoomId: 1 });
	
    await new Promise<void>(resolve => {
			socket.on(ChatEvent.JoinChatRoomSuccess, (payload: any) => {
				expect(payload.chatRoomId == 1);
				resolve();
			});
		});
	});

	it("Client send a message room: ", async () => {

		socket.emit(ChatEvent.JoinChatRoom, { chatRoomId: 1 });
    await new Promise<void>(resolve => {
			socket.on(ChatEvent.JoinChatRoomSuccess, (payload: any) => {
				expect(payload.chatRoomId == 1);
				socket.emit(ChatEvent.SendMessageToServer, {message: randMsg, chatRoomId: "1" });
				resolve();
			});
		});
	
		await new Promise<void>(resolve => {
			socket.on(ChatEvent.SendMessageToClient, (payload: any) => {
				expect(payload).toBe(randMsg);
				resolve();
			});
		});
	});

	it("Client leaves a publick room: ", async () => {
		let socket: Socket;
		socket = io("ws://localhost:3001/chat");

		socket.emit(ChatEvent.JoinChatRoom, { chatRoomId: 1 });

    await new Promise<void>(resolve => {
			socket.on(ChatEvent.JoinChatRoomSuccess, (payload: any) => {
				expect(payload.chatRoomId == 1);
				socket.emit(ChatEvent.LeaveChatRoom, { chatRoomId: 1 });
				resolve();
			});
		});
	
    await new Promise<void>(resolve => {
			socket.on(ChatEvent.LeaveChatRoomSuccess, (payload: any) => {
				expect(payload.chatRoomId == 1);
				resolve();
			});
		});
	});
});

import { ChatGateways } from "./chat.gateway";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { WsAdapter } from "@nestjs/platform-ws";
import { io, Socket } from "socket.io-client";
import { jest, expect } from "@jest/globals";
import ChatEvent from "./chatEvent";

function randomString(length: number): string {
  let result: string = "";
  let characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength: number = characters.length;
  if (Math.floor(Math.random() * charactersLength) == 10) return null;
  for (let i = 0; i < length; i++) {
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

type Message = {
  chatRoomId: string;
  message: string;
};

describe("Testing baisic connections", () => {
  let socket1: Socket;
  let socket2: Socket;
  let randMsg: string;

  beforeEach(function (done) {
    socket1 = io("http://localhost:3001/chat");
    socket2 = io("http://localhost:3001/chat");
    let gaol: number = 2;
    let now: number = 0;
    while (gaol != 2) {
      socket1.on("connect", function () {
        now++;
      });
      socket2.on("connect", function () {
        now++;
      });
    }
    randMsg = randomString(Math.random() * 20);
    done();
  });

  afterEach(function (done) {
    if (socket1.connected) {
      socket1.disconnect();
    }
    if (socket2.connected) {
      socket2.disconnect();
    }
    done();
  });

  it("2 Client 1 joins a publick room on does not 1 clinet get a message onther does not", async () => {
    socket1.emit(ChatEvent.JoinChatRoom, { chatRoomId: 1 });

    new Promise<void>(resolve => {
      socket2.onAny((event, ...args) => {
        //this one never happens which is the goal
        expect(event).toBe("clientConnected");
        socket1.emit(ChatEvent.SendMessageToServer, randMsg);
        resolve();
      });
    });
    await new Promise<void>(resolve => {
      socket1.on(ChatEvent.JoinChatRoomSuccess, (payload: any) => {
        expect(payload.chatRoomId == 1);
        socket1.emit(ChatEvent.SendMessageToServer, { chatRoomId: 1, message: randMsg });
        resolve();
      });
    });
    await new Promise<void>(resolve => {
      socket1.on(ChatEvent.SendMessageToClient, (payload: Message) => {
        expect(payload).toEqual({ chatRoomId: 1, message: randMsg });
        socket1.emit(ChatEvent.LeaveChatRoom, { chatRoomId: 1 });
        resolve();
      });
    });
    await new Promise<void>(resolve => {
      socket1.on(ChatEvent.LeaveChatRoomSuccess, (payload: any) => {
        expect(payload.chatRoomId == 1);
        socket2.disconnect();
        resolve();
      });
    });
  });
  it("2 Client joins a publick while ons is already in", async () => {
    socket1.emit(ChatEvent.JoinChatRoom, { chatRoomId: 1 });

    await new Promise<void>(resolve => {
      socket1.on(ChatEvent.JoinChatRoomSuccess, (payload: any) => {
        expect(payload.chatRoomId == 1);
        socket2.emit(ChatEvent.JoinChatRoom, { chatRoomId: 1 });
        resolve();
      });
    });
    await new Promise<void>(resolve => {
      socket2.on(ChatEvent.JoinChatRoomSuccess, (payload: any) => {
        expect(payload.chatRoomId == 1);
        resolve();
      });
    });
    await new Promise<void>(resolve => {
      socket1.on(ChatEvent.JoinChatRoomSuccess, (payload: any) => {
        expect(payload.chatRoomId == 1);
        resolve();
      });
    });
  });

  it("2 Client joins a publick while ons is already and leave it", async () => {
    socket1.emit(ChatEvent.JoinChatRoom, { chatRoomId: 1 });

    await new Promise<void>(resolve => {
      socket1.on(ChatEvent.JoinChatRoomSuccess, (payload: any) => {
        expect(payload.chatRoomId == 1);
        socket2.emit(ChatEvent.JoinChatRoom, { chatRoomId: 1 });
        resolve();
      });
    });
    await new Promise<void>(resolve => {
      socket2.on(ChatEvent.JoinChatRoomSuccess, (payload: any) => {
        expect(payload.chatRoomId == 1);
        resolve();
      });
    });
    await new Promise<void>(resolve => {
      socket1.on(ChatEvent.JoinChatRoomSuccess, (payload: any) => {
        expect(payload.chatRoomId == 1);
        socket1.emit(ChatEvent.LeaveChatRoom, { chatRoomId: 1 });
        resolve();
      });
    });
    await new Promise<void>(resolve => {
      socket1.on(ChatEvent.LeaveChatRoomSuccess, (payload: any) => {
        expect(payload.chatRoomId == 1);
        resolve();
      });
    });
    await new Promise<void>(resolve => {
      socket2.on(ChatEvent.LeaveChatRoomSuccess, (payload: any) => {
        expect(payload.chatRoomId == 1);
        socket1.emit(ChatEvent.LeaveChatRoomSuccess, { chatRoomId: 1 });
        resolve();
      });
    });
    await new Promise<void>(resolve => {
      socket2.on(ChatEvent.LeaveChatRoomSuccess, (payload: any) => {
        expect(payload.chatRoomId == 1);
        resolve();
      });
    });
  });
  /*
	it("2 Client joins a publick while ons is already in", async () => {

		socket1.emit("joinChatRoom", { chatRoomId: 1 });

    await new Promise<void>(resolve => {
			socket1.on('joinChatRoomSuccess', (payload: any) => {
				expect(payload.chatRoomId == 1);
				socket2.emit("joinChatRoom", { chatRoomId: 1 });
				resolve();
			});
		});
    await new Promise<void>(resolve => {
			socket2.on('joinChatRoomSuccess', (payload: any) => {
				expect(payload.chatRoomId == 1);
				socket2.emit("messageToServer", { chatRoomId: 1, message: randMsg });
				resolve();
			});
		});
    await new Promise<void>(resolve => {
			socket1.on('joinChatRoomSuccess', (payload: any) => {
				expect(payload.chatRoomId == 1);
				socket2.emit("joinChatRoom", { chatRoomId: 1 });
				resolve();
			});
		});
    await new Promise<void>(resolve => {
			socket1.on('messageToClient', (payload: Message) => {
				expect(payload).toEqual({ "chatRoomId": 1, "message": randMsg });
				socket1.emit("leaveChatRoom", { chatRoomId: 1 });
				resolve();
			});
		});
    await new Promise<void>(resolve => {
			socket2.on('messageToClient', (payload: Message) => {
				expect(payload).toEqual({ "chatRoomId": 1, "message": randMsg });
				socket1.emit("leaveChatRoom", { chatRoomId: 1 });
				resolve();
			});
		});
    await new Promise<void>(resolve => {
			socket1.on('leaveChatRoomSuccess', (payload: any) => {
				expect(payload.chatRoomId == 1);
				resolve();
			});
		});
    await new Promise<void>(resolve => {
			socket2.on('leaveChatRoomSuccess', (payload: any) => {
				expect(payload.chatRoomId == 1);
				resolve();
			});
		});
	});
 */
});

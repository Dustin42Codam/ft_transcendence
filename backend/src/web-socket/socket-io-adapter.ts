import { INestApplicationContext } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions } from "socket.io";

export class SocketIOAdapter extends IoAdapter {
	constructor(
		private app: INestApplicationContext,
	) {
		super(app);
	}
	createIOServer(port: number, options?: ServerOptions): any {
		const server = super.createIOServer(port, options);
		const cors = {
			coredntials: true,
			origin: [
				"http://localhost:4242",
			],
		}
		const optionWithCors: ServerOptions = {
			... options,
			cors
		}
		return super.createIOServer(3001, optionWithCors);
	}
}

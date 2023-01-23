import { INestApplicationContext, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { ConfigService } from '@nestjs/config';

export class SocketIoAdapter extends IoAdapter {
	private readonly logger = new Logger(SocketIoAdapter.name);
	constructor(
		private app: INestApplicationContext,
		private configService: ConfigService,
	) {
		super(app);
	}

	createIOServer(port: number, options?: ServerOptions) {
		port = this.configService.get<number>('SOCKETIO.SERVER.PORT');
		const path = this.configService.get<string>('SOCKETIO.SERVER.PATH');
		const origins = this.configService.get<string>(
			'SOCKETIO.SERVER.CORS.ORIGIN',
		);
		const origin = origins.split(',');
		options.path = path;
		options.cors = { origin };
		const server = super.createIOServer(port, options);
		return server;
	}
}

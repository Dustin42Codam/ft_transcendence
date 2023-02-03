import { INestApplicationContext, Logger } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions } from "socket.io";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Socket, Server } from "socket.io";
import { parse } from "cookie";

export class SocketIoAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIoAdapter.name);
  constructor(private app: INestApplicationContext, private configService: ConfigService) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const cors = {
      origin: [`http://10.10.6.8:4242`],
      credentials: true,
    };
    this.logger.log("configuring socketIO server with custom CORS options", {
      cors,
    });
    const optionsWithCors: ServerOptions = {
      ...options,
      cors,
    };
    const jwtService = this.app.get(JwtService);
    const server: Server = super.createIOServer(port, optionsWithCors);
    server.of("game").use(createTokenMiddleware(jwtService, this.logger));
    server.of("chat").use(createTokenMiddleware(jwtService, this.logger));
    return server;
  }
}

require("dotenv").config();

const createTokenMiddleware = (jwtService: JwtService, logger: Logger) => (socket: Socket, next) => {
  try {
    const cookie = parse(socket.handshake.headers.cookie);
    const token = cookie.jwt;
    logger.debug(token);
    const payload = jwtService.verify(token, { secret: process.env.JWT_SECRET });
    next();
  } catch {
    logger.error("Forbidden to login");
    next(new Error("FORBIDDEN"));
  }
};

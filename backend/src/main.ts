import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as session from "express-session";
import * as cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import { ConfigService } from "@nestjs/config";
import { SocketIoAdapter } from "./game/socketIoAdapter";

const cors = require("cors");
const express = require("express");

require("dotenv").config();
dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  app.use(
    session({
      secret: "session-secret",
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    cors({ origin: ["http://" + process.env.HOST_ID + ":4242", "http://10.10.6.12:4242", "http://10.10.6.10:4242", "http://10.10.6.8:4242"], allowedHeaders: ["Access-Control-Allow-Origin", "content-type", "Location", "Authorization", "origin", "accept"], credentials: true }),
  );
  app.useWebSocketAdapter(new SocketIoAdapter(app, configService));
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.EXPRESS_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: "auto",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 3600000,
      },
    }),
  );
  await app.listen(parseInt(process.env.BACKEND_PORT));
}
bootstrap();

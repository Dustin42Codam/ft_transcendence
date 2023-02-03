import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as session from "express-session";
import * as cookieParser from "cookie-parser";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as dotenv from "dotenv";
import { ConfigService } from "@nestjs/config";
import { SocketIoAdapter } from "./game/socketIoAdapter";

const cors = require("cors");
const express = require("express");

require("dotenv").config();

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
    cors({ origin: "http://localhost:4242", allowedHeaders: ["Access-Control-Allow-Origin", "content-type", "Location", "Authorization", "origin", "accept"], credentials: true }),
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
  const config = new DocumentBuilder().setTitle("ft_transcendence").setDescription("Team TranceDance API").setVersion("1.0").build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  await app.listen(parseInt(process.env.BACKEND_PORT));
}
bootstrap();

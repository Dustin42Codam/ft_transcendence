import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as session from "express-session";
import * as cookieParser from "cookie-parser";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from "dotenv";

const cors = require("cors");
const express = require("express");

require("dotenv").config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(parseInt(process.env.BACKEND_PORT));
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

require("dotenv").config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors({origin: true, credentials: true}));
  app.use(morgan("common"));
  app.use(express.json());
  app.use(session(
	{
	  secret: '1234567890', // don't use this secret in prod :)
	  resave: false,
	  saveUninitialized: false,
	  cookie: {
		secure: 'auto',
		httpOnly: true,
		maxAge: 3600000
	  }
	})
  );
  await app.listen(3000);
}
bootstrap();

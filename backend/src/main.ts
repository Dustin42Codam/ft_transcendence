import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser'
import * as dotenv from "dotenv";

const express = require("express");
const cors = require("cors");

require("dotenv").config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(
		session({
			secret: 'session-secret',
			resave: false,
			saveUninitialized: false,
		})
	)
	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe());
	app.use(cors({origin: true, credentials: true}));
	app.use(express.json());
	await app.listen(3000);
}
bootstrap();

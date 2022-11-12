import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

require("dotenv").config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe());
	// app.use(cors({origin: true, credentials: true}));
	app.enableCors({
		origin: 'http://localhost:4242',
		credentials: true
	});
	app.use(morgan("common"));
	app.use(express.json());
	app.use(cookieParser());
	app.use(session(
		{
			secret: process.env.EXPRESS_SECRET,
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

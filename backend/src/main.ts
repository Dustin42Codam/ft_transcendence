import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as dotenv from "dotenv";

const cors = require("cors");
const express = require("express");

require("dotenv").config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe());
	app.use(cors({origin: true, credentials: true}));
	app.use(express.json());
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
	await app.listen(parseInt(process.env.BACKEND_PORT));
}
bootstrap();

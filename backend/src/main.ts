import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

const express = require("express");
const cors = require("cors");

require("dotenv").config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe());
	app.use(cors({origin: true, credentials: true}));
	app.use(express.json());
	await app.listen(3000);
}
bootstrap();

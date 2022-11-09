import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
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
	await app.listen(parseInt(process.env.POSTGRES_PORT));
}
bootstrap();

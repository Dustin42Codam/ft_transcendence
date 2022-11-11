import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

import express from "express";

require("dotenv").config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe());
	await app.listen(3000);
}
bootstrap();

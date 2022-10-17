import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as CookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
	app.use(CookieParser());
	app.enableCors({
		origin: 'http://localhost:8081',
		credentials: true
	});
  await app.listen(3000);
}
bootstrap();

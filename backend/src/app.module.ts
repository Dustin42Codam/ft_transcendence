import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';


config();
// console.log(process.env.POSTGRES_URL);
console.log(process.env.POSTGRES_USER);
console.log(process.env.POSTGRES_PASSWORD);
console.log(process.env.POSTGRES_DB);
console.log(process.env.POSTGRES_URL);
@Module({
  imports: 
  [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync
    ({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          url: process.env.POSTGRES_URL, 
          // username: configService.get('POSTGRES_USER'),
          // password: configService.get('POSTGRES_PASSWORD'),
          // database: configService.get('POSTGRES_DB'),
          entities: [],
          autoLoadEntities: true,
          synchronize: true
        }),
    }),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { ChatModule } from './chat/chat.module';

const pathToEnv: string = '.env';
config({path: pathToEnv});
@Module({
  imports: 
  [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync
    ({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: () => ({
          type: 'postgres',
          url: process.env.POSTGRES_URL, // combined host://user:password@host:portnum/db_name
          entities: [],
          autoLoadEntities: true,
          synchronize: true
        }),
    }),
    UsersModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}

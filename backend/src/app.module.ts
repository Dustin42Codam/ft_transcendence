import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

const pathToEnv: string = '.env';
config({path: pathToEnv});
@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync
    ({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: () => ({
          type: 'postgres',
          url: process.env.POSTGRES_URL, // combined host://user:password@host:portnum/db_name
          username: 'user',
          password: 'SuperSecret',
          entities: [],
          autoLoadEntities: true,
          synchronize: true
        }),
    }),
    //always remember to put the modules in here or it doesn't work...
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

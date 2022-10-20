import { Module } from '@nestjs/common';
import { User } from './user/models/user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { config } from 'dotenv';
import { ConfigModule, ConfigService } from '@nestjs/config';

const pathToEnv: string = '.env';
config({path: pathToEnv});

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'root',
      password: 'SuperSecret',
      database: 'ft_trance',
      entities: [
        User,
      ],
      autoLoadEntities: true,//do not use this in prod
      synchronize: true,
    }),
    AuthModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

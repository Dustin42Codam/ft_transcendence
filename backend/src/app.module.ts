import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { CommonModule } from "./common/common.module";
// import { APP_GUARD } from '@nestjs/core';
import { LogoutModule } from "./logout/logout.module";
import { OauthCallbackModule } from "./oauth-callback/oauth-callback.module";
import { BlockModule } from "./blocked/block.module";
import * as dotenv from "dotenv";
import { FriendModule } from "./friend/friend.module";
import { MemberModule } from "./member/member.module";
import { ChatroomModule } from "./chatroom/chatroom.module";
import { GameModule } from "./game/game.module";
import { GameStatsModule } from "./games_stats/game_stats.module";
import { MessageModule } from "./message/message.module";
import { TFAModule } from "./tfa/tfa.module";


dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "postgres",
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    BlockModule,
    ChatroomModule,
    CommonModule,
    FriendModule,
    LogoutModule,
    GameModule,
    GameStatsModule,
    MemberModule,
    MessageModule,
    OauthCallbackModule,
    UserModule,
    TFAModule,
  ],
  providers: [],
})
export class AppModule {}

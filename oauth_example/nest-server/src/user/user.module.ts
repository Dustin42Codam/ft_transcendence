import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './models/user.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([User])
	],
  	controllers: [UserController]
})
export class UserModule {}

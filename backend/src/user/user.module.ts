import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './models/user.entity'
import { UserService } from './user.service';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
import { UploadController } from './upload.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		CommonModule,
		AuthModule
	],
  	controllers: [UserController, UploadController],
  	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}

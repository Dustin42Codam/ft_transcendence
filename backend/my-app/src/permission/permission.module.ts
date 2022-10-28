import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
	imports: [
		TypeOrmModule.forFeature([Permission]),
	],
	controllers: [PermissionController],
	providers: [PermissionService, JwtService]
})
export class PermissionModule {}

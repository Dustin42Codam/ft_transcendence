import { UseGuards, Body, Post, Controller, Get } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Permission } from './permission.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { HasPermission } from './has-permission.decorator';

@UseGuards(AuthGuard)
@Controller('permissions')
export class PermissionController {
	constructor(private permissionService: PermissionService) {}

	@Get()
	async all() {
		return this.permissionService.all();
	}
}

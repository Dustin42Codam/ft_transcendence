import { BadRequestException, UseGuards, Body, Post, Controller, Get } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Permission } from './permission.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { HasPermission } from './has-permission.decorator';
import { PermissionCreateDto } from './models/permission-create.dto';

// @UseGuards(AuthGuard)
@Controller('permissions')
export class PermissionController {
	constructor(private permissionService: PermissionService) {}

	@Get()
	async all() {
		return this.permissionService.all();
	}

	@Post()
	async create(@Body() body: PermissionCreateDto): Promise<Permission> {
		const permission = await this.permissionService.findOne({name: body.name});

		if (permission)
			throw new BadRequestException('This permission already exists!');

		return this.permissionService.create(body);
	}
}

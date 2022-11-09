import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BannedService } from './banned.service';
import { CreateBannedDto } from './dto/create-banned.dto';
import { UpdateBannedDto } from './dto/update-banned.dto';

@Controller('banned')
export class BannedController {
  constructor(private readonly bannedService: BannedService) {}

  @Post()
  create(@Body() createBannedDto: CreateBannedDto) {
    return this.bannedService.create(createBannedDto);
  }

  @Get()
  findAll() {
    return this.bannedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannedService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBannedDto: UpdateBannedDto) {
    return this.bannedService.update(+id, updateBannedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannedService.remove(+id);
  }
}

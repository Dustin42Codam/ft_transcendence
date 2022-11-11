import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlockedService } from './blocked.service';
import { CreateBlockedDto } from './dto/create-blocked.dto';

@Controller('blocked')
export class BlockedController {
  constructor(private readonly blockedService: BlockedService) {}

  @Post()
  async block(@Body() createBlockedDto: CreateBlockedDto) {
    const block = await this.blockedService.findOne({
      sender_id: createBlockedDto.sender_id,
      receiver_id: createBlockedDto.receiver_id,
    });
    if (block)
      return block;
    return this.blockedService.create(createBlockedDto);
  }

  @Get()
  findAll() {
    return this.blockedService.all();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.blockedService.findOne(id);
  }

  @Get('blocked/received/:id')
  getAllBlocksReceived(
    @Param('id') id: number
  ) {
    return this.blockedService.getAllBlocksReceived(id);
  }

  @Get('blocked/send/:id')
  getAllBlocksSend(
    @Param('id') id: number
  ) {
    return this.blockedService.getAllBlocksSend(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.blockedService.delete(id);
  }
}

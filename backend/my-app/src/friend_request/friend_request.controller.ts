import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FriendRequestService } from './friend_request.service';
import { CreateFriendRequestDto } from './dto/create-friend_request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend_request.dto';

@Controller('friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post()
  create(@Body() createFriendRequestDto: CreateFriendRequestDto) {
    return this.friendRequestService.create(createFriendRequestDto);
  }

  @Get()
  findAll() {
    return this.friendRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendRequestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFriendRequestDto: UpdateFriendRequestDto) {
    return this.friendRequestService.update(+id, updateFriendRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendRequestService.remove(+id);
  }
}

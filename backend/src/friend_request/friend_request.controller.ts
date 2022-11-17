import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FriendRequestService } from './friend_request.service';
import { CreateFriendRequestDto } from './dto/create-friend_request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend_request.dto';
import { AcceptFriendRequestDto } from './dto/accept-friend-request.dto';

@Controller('friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post()
  async createFriendRequest(@Body() createFriendRequestDto: CreateFriendRequestDto) {
    //check if sender is not blocked by receiver
    const friendRequest = await this.friendRequestService.findOne({
      sender_id: createFriendRequestDto.sender_id,
      receiver_id: createFriendRequestDto.receiver_id,
    });
    if (friendRequest)
      return friendRequest;
    return this.friendRequestService.createFriendRequest(createFriendRequestDto);
  }

  @Get()
  findAll() {
    return this.friendRequestService.all();
  }

  @Get('send/:id')
  getAllSendFriendRequest(
    @Param('id') id: number
  ) {
    return this.friendRequestService.getAllSendFriendRequest(id);
  }

  @Get('received/:id')
  getAllReceivedFriendRequest(
    @Param('id') id: number
  ) {
    return this.friendRequestService.getAllReceivedFriendRequest(id);
  }

  @Post('accept/:id')
  acceptfriendRequestById(
    @Param('id') id: number,
    @Body() body: AcceptFriendRequestDto
  ) {
    //check if the request exist
    //check if the user that accepts is also the person hte request is send to;
    // return this.
  }

  @Post('decline/:id')
  declinefriendRequestById(
    @Param('id') id: number
  ) {
    return this.friendRequestService.delete(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.friendRequestService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateFriendRequestDto: UpdateFriendRequestDto) {
    return this.friendRequestService.update(id, updateFriendRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.friendRequestService.delete(id);
  }
}

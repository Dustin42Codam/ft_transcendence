import { Body, BadRequestException, Controller, Get, Param, Post } from "@nestjs/common";
import { AuthController } from "src/auth/auth.controller";
import { MemberService } from "src/member/member.service";
import { UserService } from "src/user/user.service";

import { MessageService } from "./message.service";
import { MessageCreateDto } from "./dto/messagecreate.dto";
import { Message } from "./entity/message.entity";
import { Member } from "src/member/entity/member.entity";
import { BlockService } from "src/blocked/block.service";
import { Block } from "src/blocked/entity/block.entity";
import { User } from "src/user/entity/user.entity";

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService,
    private readonly memberService: MemberService,
    private readonly blockService: BlockService,
    private readonly userService: UserService) {}

  @Get()
  async getAllMessages(
  ) {
    return this.messageService.all();
  }


  @Get(':id')
  async getMessages(
    @Param('id') id: number,
  ) {
      const messages : Message[] = []; 
      const check_messages = await this.messageService.all();
      const user: User = await this.userService.getUserById(id);
      const member: Member = await this.memberService.getMemberById(id);
      for (const message of check_messages) {
        const block: Block = await this.blockService.getBlockById(message.member.user.id);
        if (block.receiver.id === message.member.user.id && block.sender.id === user.id)
          console.log("This user is blocked");
        if (await this.memberService.isRestricted(member))
          console.log("This user is banned or muted");
        else
          messages.push(message);
      }
      return messages;
  }

  @Post()
  async createMessage(
    @Body() body: MessageCreateDto,
  ) {
    const member : Member = await this.memberService.getMemberById(Number(body.member));
    if (member.banned === true) {
      throw new BadRequestException("You are banned from this chatroom.");
    }
    return this.messageService.create({timestamp: new Date(), member: member, message: body.message});
  }
}
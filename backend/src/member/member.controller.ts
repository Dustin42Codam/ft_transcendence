import { Body, UseGuards, BadRequestException, Controller, Get, Param, Post, Req } from "@nestjs/common";

import { Member, MemberRole, MemberStatus } from "./entity/member.entity";
import { MemberService } from "./member.service";
import { MemberCreateDto } from "./dto/member-create.dto";
import { ChatroomType } from "src/chatroom/entity/chatroom.entity";
import { ChatroomService } from "src/chatroom/chatroom.service";
import { UserService } from "src/user/user.service";
import { AuthGuard } from "src/auth/auth.guard";
import express, { Request } from "express";
import { AuthService } from "src/auth/auth.service";

@UseGuards(AuthGuard)
@Controller("member")
export class MemberController {
  constructor(
	private memberService: MemberService,
	private chatroomService: ChatroomService,
	private userServcie: UserService,
	private authService: AuthService
) {}

  @Get(":id")
  async getMemberById(@Param("id") id: string) {
    return this.memberService.getMemberById(Number(id));
  }

  @Get("chatroom/id/:id")
  async getAllMembersFromChatroom(@Param("id") id: string) {
    const chatroom = await this.chatroomService.getChatroomById(Number(id));
    return this.memberService.getAllMembersFromChatroom(chatroom);
  }

  @Post("leave/:id")
  async leaveChatroom(
    @Param("id") id: string,
    @Req() request: Request,
  ) {
    const member = await this.memberService.getMemberById(Number(id));
	  const userId = await this.authService.userId(request)
    if (userId !== member.user.id) {
		  throw new BadRequestException("You can not leave a chatroom you are not in.");
	  }
    const members = await this.memberService.getAllMembersFromChatroom(member.chatroom);
    if (members.length === 1) {
      return await this.chatroomService.deleteChatroom(member.chatroom.id);
    }
    if (member.chatroom.type === ChatroomType.DIRECT) {
		  throw new BadRequestException("You can not leave a DIRECT chatroom.");
	  }
    if (member.role === MemberRole.OWNER) {
		  throw new BadRequestException("A OWNER of a chatroom can not leave a chatroom. Give someone else the OWNER role if you want to leave.");
	  }
    member.status = MemberStatus.INACTIVE;
    await this.memberService.update(member.id, member);
  }

  
  @Post("ban/:id")
  async banMember(@Param("id") id: string, @Req() request: Request) {
    const receiver = await this.memberService.getMemberById(Number(id));
    if (receiver.role === MemberRole.OWNER) {
		  throw new BadRequestException("The OWNER of a chatroom can not be banned.");
	  }
	  const userId = await this.authService.userId(request)
    const user = await this.userServcie.getUserById(userId);
    const sender = await this.memberService.getMemberByUserAndChatroom(user, receiver.chatroom);
    if (sender.role !== MemberRole.ADMIN && sender.role !== MemberRole.OWNER) {
		  throw new BadRequestException("You do not have the rights to ban members of this chatroom.");
	  }
    if (sender.id === receiver.id) {
		  throw new BadRequestException("You can not ban yourself.");
	  }
    receiver.banned = true;
    await this.memberService.update(receiver.id, receiver);
  }

  @Post("unban/:id")
  async unbanMember(
    @Param("id") id: string,
    @Req() request: Request
  ) {
    const receiver = await this.memberService.getMemberById(Number(id));
	  const userId = await this.authService.userId(request)
    const user = await this.userServcie.getUserById(userId);
    const sender = await this.memberService.getMemberByUserAndChatroom(user, receiver.chatroom);
    if (sender.role !== MemberRole.ADMIN && sender.role !== MemberRole.OWNER) {
		  throw new BadRequestException("You do not have the rights to unban members of this chatroom.");
	  }
    if (sender.id === receiver.id) {
		  throw new BadRequestException("You can not unban yourself.");
	  }
    receiver.banned = false;
    return await this.memberService.update(receiver.id, receiver);
  }

  @Post("mute/:id")
  async muteMemberForTimePeriod(
    @Param("id") receiverId: string,
    @Req() request: Request
  ) {
    const receiver = await this.memberService.getMemberById(Number(receiverId));
    if (receiver.role === MemberRole.OWNER) {
		  throw new BadRequestException("The OWNER of a chatroom can not be muted.");
	  }
    const userId = await this.authService.userId(request)
    const user = await this.userServcie.getUserById(userId);
    const sender = await this.memberService.getMemberByUserAndChatroom(user, receiver.chatroom);
    if (sender.role !== MemberRole.ADMIN && sender.role !== MemberRole.OWNER) {
		  throw new BadRequestException("You do not have the rights to mute members of this chatroom.");
	  }
    if (sender.id === receiver.id) {
		  throw new BadRequestException("You can not mute yourself.");
	  }
    receiver.muted_until = new Date(new Date().getTime() + 420 * 1000); //TODO change this to 25 sec or so for evaluation
    await this.memberService.update(receiver.id, receiver);
  }

  @Post("unmute/:id")
  async unmuteMember(@Param("id") id: string, @Req() request: Request) {
    const receiver = await this.memberService.getMemberById(Number(id));
	  const userId = await this.authService.userId(request)
    const user = await this.userServcie.getUserById(userId);
    const sender = await this.memberService.getMemberByUserAndChatroom(user, receiver.chatroom);
    if (sender.role !== MemberRole.ADMIN && sender.role !== MemberRole.OWNER) {
		  throw new BadRequestException("You do not have the rights to unmute members of this chatroom.");
	  }
    if (sender.id === receiver.id) {
		  throw new BadRequestException("You can not unmute yourself.");
	  }
    receiver.muted_until = new Date(new Date().getTime());
    return await this.memberService.update(receiver.id, receiver);
  }

  @Post("makeAdmin/:id")
  async makeMemberAdmin(@Param("id") id: string, @Req() request: Request) {
    const receiver = await this.memberService.getMemberById(Number(id));
    if (receiver.role === MemberRole.OWNER) {
		  throw new BadRequestException("The OWNER of a chatroom can not be made Admin.");
	  }
	  const userId = await this.authService.userId(request)
    const user = await this.userServcie.getUserById(userId);
    const sender = await this.memberService.getMemberByUserAndChatroom(user, receiver.chatroom);
    if (sender.role !== MemberRole.ADMIN && sender.role !== MemberRole.OWNER) {
		  throw new BadRequestException("You do not have the rights to a member a ADMIN.");
	  }
    receiver.role = MemberRole.ADMIN;
    await this.memberService.update(receiver.id, receiver);
  }

  @Post("removeAdmin/:id")
  async removeAdmin(@Param("id") id: string, @Req() request: Request) {
    const receiver = await this.memberService.getMemberById(Number(id));
    if (receiver.role !== MemberRole.ADMIN) {
		  throw new BadRequestException("This member is not an admin.");
	  }
	  const userId = await this.authService.userId(request)
    const user = await this.userServcie.getUserById(userId);
    const sender = await this.memberService.getMemberByUserAndChatroom(user, receiver.chatroom);
    if (sender.role !== MemberRole.OWNER) {
		  throw new BadRequestException("You do not have the rights to remove a ADMIN role from member.");
	  }
    receiver.role = MemberRole.USER;
    return await this.memberService.update(receiver.id, receiver);
  }

  @Post("owner/:id")
  async makeOwner(@Param("id") id: string, @Req() request: Request) {
    const receiver = await this.memberService.getMemberById(Number(id));
	  const userId = await this.authService.userId(request)
    const user = await this.userServcie.getUserById(userId);
    const sender = await this.memberService.getMemberByUserAndChatroom(user, receiver.chatroom);
    if (sender.role !== MemberRole.OWNER) {
		  throw new BadRequestException("You do not have the rights to make a member OWNER.");
	  }
    receiver.role = MemberRole.OWNER;
    await this.memberService.update(receiver.id, receiver);
    sender.role = MemberRole.ADMIN;
    await this.memberService.update(sender.id, sender);
  }

  // @Get("restricted/:id") //TODO this is only for testing, should be removed probably
  // async isRestricted(@Param("id") id: string) {
  //   const member = await this.memberService.getMemberById(Number(id));
  //   return this.memberService.isRestricted(member);
  // }
}

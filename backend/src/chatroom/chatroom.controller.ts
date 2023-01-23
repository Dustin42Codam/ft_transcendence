import { Body, UseGuards, BadRequestException, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { MemberRole, MemberStatus } from "src/member/entity/member.entity";
import { MemberService } from "src/member/member.service";
import { User } from "src/user/entity/user.entity";
import { UserService } from "src/user/user.service";
import { ChatroomService } from "./chatroom.service";
import { AddUserDto } from "./dto/chatroom-add-user.dto";
import { ChatroomChangeNameDto } from "./dto/chatroom-change-name.dto";
import { ChatroomChangeTypeDto } from "./dto/chatroom-change-type.dto";
import { ChatroomCreateDto } from "./dto/chatroom-create.dto";
import { ChatroomChangePasswordDto } from "./dto/chtroom-change-password.dto";
import { ChatroomType } from "./entity/chatroom.entity";
import express, { Request } from "express";
import * as bcrypt from "bcrypt";
import { JoinChatroomDto } from "./dto/chatroom-join.dto";
import { BlockService } from "src/blocked/block.service";
import { AuthService } from "src/auth/auth.service";
import { FriendService } from "src/friend/friend.service";

@UseGuards(AuthGuard)
@Controller("chatroom")
export class ChatroomController {
  constructor(
    private readonly memberService: MemberService,
    private readonly chatroomService: ChatroomService,
    private readonly userService: UserService,
    private readonly friendService: FriendService,
    private readonly authService: AuthService,
  ) {}

  @Get("join")
  async getJoinableChatroomsForUser(@Req() request: Request) {
	  const userId = await this.authService.userId(request)
    const user = await this.userService.getUserById(userId);
    return this.chatroomService.getAllJoinableChatroomForUser(user);
  }

  @Get("group")
  async getGroupchatsFromUser(@Req() request: Request) {
	  const userId = await this.authService.userId(request)
    const user = await this.userService.getUserById(userId);
    return this.chatroomService.getGroupchatsFromUser(user);
  }

  @Get("dm")
  async getDMsFromUser(@Req() request: Request) {
	  const userId = await this.authService.userId(request)
    const user = await this.userService.getUserById(userId);
    return await this.chatroomService.getDMsFromUser(user);
  }

  @Get("id/:id")
  async getChatroomById(@Param("id") id: string) {
    return this.chatroomService.getChatroomById(Number(id));
  }

  @Get("name/:name")
  async getChatroomByName(@Param("name") name: string) {
    return this.chatroomService.getChatroomByName(name);
  }

  @Get("all")
  async getAllChatsFromUser(@Req() request: Request) {
	  const userId = await this.authService.userId(request)
    const user = await this.userService.getUserById(userId);
    return this.chatroomService.getAllChatsFromUser(user);
  }

  @Get("joinable/id/:id")
  async getJoinableFriendsForChatroom(
    @Param("id") id: string,
    @Req() request: Request,
  ) {
    const userId = await this.authService.userId(request);
    const user = await this.userService.getUserById(userId);
    const chatroom = await this.chatroomService.getChatroomById(Number(id));
    const friends = await this.friendService.getAllFriendshipsFromUser(user.id)
    var allJoinableFriends: User[] = [];
    for(const friend of friends) {
      let alreadyInChat = false;
      for(const member of chatroom.users) {
        if (member.user.id == friend.id) {
          alreadyInChat = true;
        }
      }
      if (!alreadyInChat) {
        allJoinableFriends.push(friend);
      }
    }
    return allJoinableFriends;
  }

  @Post("type/id/:id")
  async changeChatroomType(@Param("id") id: string, @Body() body: ChatroomChangeTypeDto, @Req() request: Request) {
    if (![ChatroomType.DIRECT, ChatroomType.PRIVATE, ChatroomType.PUBLIC, ChatroomType.PROTECTED].includes(body.type)) {
      throw new BadRequestException("This chatroomtype does not exist.");
    }
    if (body.type === ChatroomType.DIRECT) {
      throw new BadRequestException("You are not allowed to change to a DIRECT type.");
    }
    const chatroom = await this.chatroomService.getChatroomById(Number(id));
    if (body.type === chatroom.type) {
      throw new BadRequestException("The chatroom already has this type.");
    }
    const userId = await this.authService.userId(request)
    const user = await this.userService.findOne({ id: userId });
    const member = await this.memberService.getMemberByUserAndChatroom(user, chatroom);
    if (!member) {
      throw new BadRequestException("You are not a Member of this chatroom.");
    }
    if (member.role != MemberRole.OWNER) {
      throw new BadRequestException("Only a OWNER is allowed to change the type of a chatroom");
    }
    if (body.type === ChatroomType.PROTECTED) {
      if (!body.password) {
        throw new BadRequestException("You need a password to change to a PROTECTED chatroom.");
      }
      body.password = await this.chatroomService.hashPassword(body.password);
    } else {
      body.password = null;
    }
    this.chatroomService.update(chatroom.id, body);
  }

  @Post("remove/id/:id")
  async removeChatroom(@Req() request: Request, @Param("id") id: string) {
    const chatroom = await this.chatroomService.getChatroomById(Number(id));
	const userId = await this.authService.userId(request)
    const user = await this.userService.getUserById(userId, ["chatrooms"]);
    const member = await this.memberService.getMemberByUserAndChatroom(user, chatroom);
    if (member.role !== MemberRole.OWNER) {
		throw new BadRequestException("You are not the owner of this chatroom.");
	}
    return await this.chatroomService.deleteChatroom(chatroom.id);
  }

  @Post("name/id/:id")
  async changeName(@Param("id") id: string, @Body() body: ChatroomChangeNameDto, @Req() request: Request) {
    const sameNameChatroom = await this.chatroomService.findOne({name: body.name})
    if (sameNameChatroom)
    {
      throw new BadRequestException("There already exists a chatroom with this name.");
    }
    const chatroom = await this.chatroomService.getChatroomById(Number(id));
    if (chatroom.type == ChatroomType.DIRECT) {
		  throw new BadRequestException("The name of this chatroom can not be changed.");
	  }
	  const userId = await this.authService.userId(request)
    const user = await this.userService.getUserById(userId);
    const member = await this.memberService.getMemberByUserAndChatroom(user, chatroom);
    if (!member) {
		  throw new BadRequestException("You are not a Member of this chatroom.");
	  }
    if (member.role == MemberRole.USER) {
		  throw new BadRequestException("A USER of a chatroom is not allowed to change the name of a chatroom.");
	  }
    this.chatroomService.update(chatroom.id, body);
  }

  @Post("password/id/:id")
  async changePassword(@Param("id") id: string, @Body() body: ChatroomChangePasswordDto, @Req() request: Request) {
    const chatroom = await this.chatroomService.getChatroomById(Number(id));
    if (chatroom.type !== ChatroomType.PROTECTED) {
		  throw new BadRequestException("This chatroom does not have a password.");
	  }
	  const userId = await this.authService.userId(request)
    const user = await this.userService.getUserById(userId);
    const member = await this.memberService.getMemberByUserAndChatroom(user, chatroom);
    if (!member) {
		  throw new BadRequestException("You are not a Member of this chatroom.");
	  }
    if (member.role !== MemberRole.OWNER) {
		  throw new BadRequestException("Only a OWNER is allowed to change the password of a chatroom");
	  }
    body.password = await this.chatroomService.hashPassword(body.password);
    this.chatroomService.update(chatroom.id, body);
  }

  @Post("join/id/:id")    
  async joinChatroom(@Param("id") id: string, @Body() body: JoinChatroomDto, @Req() request: Request) {
    console.log("🚀 ~ file: chatroom.controller.ts:116 ~ ChatroomController ~ joinChatroom ~ body", body)
    
    const chatroom = await this.chatroomService.getChatroomById(Number(id));
    if ([ChatroomType.DIRECT, ChatroomType.PRIVATE].includes(chatroom.type)) {
		  throw new BadRequestException("You can not join a PRIVATE or DIRECT chatroom.");
	  }
	  const userId = await this.authService.userId(request)
    const user = await this.userService.getUserById(userId);
    const member = await this.memberService.findOne({
      user: user,
      chatroom: chatroom,
    });
    if (member && member.status === MemberStatus.ACTIVE) {
		  return member;
	  }
    if (chatroom.type === ChatroomType.PROTECTED) {
      if (!body.password) {
		    throw new BadRequestException("You need password to join a PROTECTED chatroom.");
	    }
      const hashword = await this.chatroomService.hashPassword(body.password);
      if (hashword !== chatroom.password) {
		    throw new BadRequestException("The password is incorrect");
	    }
    }
    if (member) {
      member.status = MemberStatus.ACTIVE
      await this.memberService.update(member.id, member);
      return member
    }
    return await this.memberService.createMember({ user: user, chatroom: chatroom, role: MemberRole.USER });
  }

  @Post("add/id/:id")
  async addUserToChatroom(@Param("id") id: string, @Body() body: AddUserDto, @Req() request: Request) {
    console.log("🚀 ~ file: chatroom.controller.ts:173 ~ ChatroomController ~ addUserToChatroom ~ body", body)
    const chatroom = await this.chatroomService.getChatroomById(Number(id));
    if (chatroom.type == ChatroomType.DIRECT) {
      throw new BadRequestException("You can not add a User to a DIRECT chatroom.");
    }
	  const senderId = await this.authService.userId(request)
    const sender = await this.userService.getUserById(senderId);
    const senderMember = await this.memberService.getMemberByUserAndChatroom(sender, chatroom);
    if (senderMember.role == MemberRole.USER) {
		  throw new BadRequestException("A User of a chatroom is not allowed to add users.");
	  }
    if (this.memberService.isRestricted(senderMember)) {
		  throw new BadRequestException("You are not allowed to add user while being restricted.");
	  }
    const receiver = await this.userService.getUserById(body.user_id);
    const friendship = await this.friendService.getFriendshipByUserids(sender.id, receiver.id);
    if (!friendship) {
      throw new BadRequestException("You are not allowed to add users that are not your friends.");
    }
    const receiverMember = await this.memberService.findOne({ user: receiver, chatroom: chatroom }, ["user", "chatroom"]);
    if (receiverMember) {
      if (receiverMember.status === MemberStatus.INACTIVE) {
        receiverMember.status = MemberStatus.ACTIVE
        await this.memberService.update(receiverMember.id, receiverMember);
      }
		  return receiverMember;
	  }
    return await this.memberService.createMember({ user: receiver, chatroom: chatroom, role: MemberRole.USER });
  }
	@Post('create')
	async createChatroom(
		@Body() body: ChatroomCreateDto,
		@Req() request: Request
	) {
		if (![ChatroomType.DIRECT, ChatroomType.PRIVATE, ChatroomType.PUBLIC, ChatroomType.PROTECTED].includes(body.type)) {
			throw new BadRequestException("This chatroomtype does not exist.");
		}
		if (body.type === ChatroomType.DIRECT) {
			throw new BadRequestException("You can not create a DIRECT chatroom.");
		}
		if (body.password && (body.type === ChatroomType.PRIVATE || body.type === ChatroomType.PUBLIC)) {
			throw new BadRequestException("PUBLIC or PRIVATE CHATROOMS can not have a password.");
		}
		else if (!body.password && body.type === ChatroomType.PROTECTED) {
			throw new BadRequestException("PROTECTED chatrooms need to have a password.");
		}
    const chatroom = await this.chatroomService.findOne({name: body.name})
	console.log(chatroom)
    if (chatroom)
    {
      throw new BadRequestException("There already exists a chatroom with this name.");
    }
		const {user_ids, ...createChatroom} = body;
    if (body.password && body.type === ChatroomType.PROTECTED){
      createChatroom.password = await this.chatroomService.hashPassword(body.password);
    }
    const user = await this.userService.getUserById(await this.authService.userId(request));
    user_ids.push(Number(user.id));
		const uniqueUsers : number[] = [... new Set(user_ids)];
		var users : User[]= []
        for (var user_id of uniqueUsers) {
				const user = await this.userService.findOne({id: user_id});
				if (!user)
					throw new BadRequestException("One of the users does not exist.");
				users.push(user)
		}
		return this.chatroomService.createChatroom(users, createChatroom, user.id);
	}
}

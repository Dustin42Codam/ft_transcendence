import { HttpCode, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import ChatEntity from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private chatRespository: Repository<ChatEntity>
  ) {};


  create(chatData: CreateChatDto) {
    try {
      const newChat = this.chatRespository.create({...chatData});
      this.chatRespository.save(newChat);
      console.log("New user added")
    }
    catch (error)
    {
      throw new HttpException('Incomplete data', HttpStatus.BAD_REQUEST);
    }
    return 'This action adds a new chat';
  }

  findAll() {
    return this.chatRespository.find();
  }

  findOneById(id: number): Promise<ChatEntity> {
    const chat = this.chatRespository.findOneBy({ id: id });

    if (!chat)
    {
      console.log("Chat not found");
      throw new HttpException('No chat found', HttpStatus.NOT_FOUND);
    }
    return this.chatRespository.findOneBy({ id: id });
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  // const mockUser
  remove(id: number) {
    const chatToRemove = this.findOneById(id);

    if (chatToRemove)
    {
      //  await this.chatRespository.remove([chatToRemove]);
    }
  }
}

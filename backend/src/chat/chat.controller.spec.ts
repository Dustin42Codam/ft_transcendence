import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatController } from "./chat.controller"
import { ChatService } from "./chat.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import Chat from "./entities/chat.entity";

describe('ChatController', () => {
    let chatController: ChatController;
    let chatService: ChatService;

    beforeEach( async () => {
        const module = await Test.createTestingModule({
            imports: [TypeOrmModule.forFeature([Chat])],
            controllers: [ChatController],
            providers: [ChatService]
        }).compile();

        chatService = module.get<ChatService>(ChatService);
        chatController = module.get<ChatController>(ChatController);
    });

    describe('Get /chat', () => {
        it('should return all db chats', async () => {
            const expectedResult: string = 'This action returns all chat';
            expect(chatController.findAll()).toBe(expectedResult);
        })
    })
})

import { ChatController } from "./chat.controller"
import { ChatService } from "./chat.service";
import { CreateChatDto } from "./dto/create-chat.dto";

describe('ChatController', () => {
    let chatController: ChatController;
    let chatService: ChatService;

    beforeEach(() => {
        chatService = new ChatService();
        chatController = new ChatController(chatService);
    });

    describe('Get /chat', () => {
        it('should return all db chats', async () => {
            const expectedResult: string = 'This action returns all chat';
            // jest.spyOn(chatService, 'findAll').mockImplementation(() => result);
            // console.log("result: ",  result);
            expect(chatController.findAll()).toBe(expectedResult);
        })
    })
})

import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../user/user.service' 
import { User } from '../user/models/user.entity';

@Controller()
export class AuthController {

      constructor(private userService: UserService) {

      }



      @Post('register')
      async register(@Body() body) {
            return this.userService.create(body);
      }

}

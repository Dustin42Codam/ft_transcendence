import { Injectable } from '@nestjs/common';
import bcrypt from "bcrypt";

// later

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  
  PostFromVue(): string {
    return 'Hello Vue!';
  }
}

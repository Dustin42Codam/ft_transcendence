import { Injectable } from '@nestjs/common';
import { CreateBannedDto } from './dto/create-banned.dto';
import { UpdateBannedDto } from './dto/update-banned.dto';

@Injectable()
export class BannedService {
  create(createBannedDto: CreateBannedDto) {
    return 'This action adds a new banned';
  }

  findAll() {
    return `This action returns all banned`;
  }

  findOne(id: number) {
    return `This action returns a #${id} banned`;
  }

  update(id: number, updateBannedDto: UpdateBannedDto) {
    return `This action updates a #${id} banned`;
  }

  remove(id: number) {
    return `This action removes a #${id} banned`;
  }
}

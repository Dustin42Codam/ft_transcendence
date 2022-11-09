import { PartialType } from '@nestjs/mapped-types';
import { CreateBannedDto } from './create-banned.dto';

export class UpdateBannedDto extends PartialType(CreateBannedDto) {}

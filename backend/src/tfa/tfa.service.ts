import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AbstractService } from "src/common/abstract.service";
import { TFA } from "./entity/tfa.entity";

@Injectable()
export class TFAService extends AbstractService {
  constructor(@InjectRepository(TFA) private readonly TFARepository: Repository<TFA>) {
    super(TFARepository);
  }
}

import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AbstractService } from "src/common/abstract.service";

import { Match } from "./entity/match.entity";
import { MatchCreateDto } from "./dto/match-create.dto";

@Injectable()
export class MatchService extends AbstractService {
  constructor(
		@InjectRepository(Match) private readonly matchRepository: Repository<Match>
	) {
		super(matchRepository);
	}

    async getMatchById(id: number) {
        const match = this.findOne({id});
        if (!match)
            throw new BadRequestException("This match does not exist");
		return match;
	}

    async createMatch(matchCreateDto: MatchCreateDto) {
        return await this.create(matchCreateDto);
    }

    async deleteFriendship(match: Match) {
        return await this.delete(match.id);
    }
}
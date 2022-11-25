import { Body, BadRequestException, Controller, Get, Param, Post } from "@nestjs/common";
import { MatchCreateDto } from "./dto/match-create.dto";
import { MatchService } from "./match.servic";

@Controller('match')
export class MatchController {
	constructor(private readonly matchService: MatchService) {}
	

    @Get(':id')
    async getMatchById(
        @Param('id') id : string
    ) {
        return await this.matchService.getMatchById(Number(id));
    }

    @Post()
    async   createMatch(
        @Body() body: MatchCreateDto
    ) {
        return await this.matchService.createMatch(body);
    }

    @Post(':id')
    async   deleteMatch(
        @Param('id') id: string
    ) {
        return await this.matchService.delete(Number(id));
    }
}
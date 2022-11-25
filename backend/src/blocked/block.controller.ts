import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { BlockService } from "./block.service";
import { BlockCreateDto } from "./dto/block-create.dto";

@Controller('block')
export class BlockController {
	constructor(private readonly blockService: BlockService) {}
	
	@Get(':id')
	async getUserById(
		@Param('id') id : string
	) {
		return this.blockService.getBlockById(Number(id));
	}

	@Post()
	async block(
		@Body() blockCreateDto: BlockCreateDto,
	) {
		//TODO authgaurd to make sure that the sender is the auth user
		// if (req.session.userId !== blockCreateDto.sender.id)
			// throw BadRequestException("You can only send a block from yourself")
		const block = await this.blockService.findOne({
			sender: blockCreateDto.sender,
			receiver: blockCreateDto.receiver,
		});
		if (block)
			return block;
		return await this.blockService.block(blockCreateDto);
	}

	@Post(':id')
	remove(
    	@Param('id') id: string
    ) {
    	//TODO authgaurd to make sure that the sender of the block is the auth user
    	return this.blockService.delete(Number(id));
	}
}

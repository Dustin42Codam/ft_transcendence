import { IsNotEmpty, IsOptional } from "class-validator";
import { Reactions } from "../entities/post.entity";

export class CreatePostDto {
	@IsNotEmpty()
	title: string;
	
	@IsNotEmpty()
	content: string;

	@IsNotEmpty()
	user: string;

	@IsOptional()
	date: Date;
	
	@IsOptional()
	reactions: Reactions;
}

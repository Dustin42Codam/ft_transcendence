import { Get, Post, Controller, UploadedFile, UseInterceptors, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';

require("dotenv").config();

@Controller()
export class UploadController {
	@Post('upload')
	@UseInterceptors(
		FileInterceptor('image',
		{
			storage: diskStorage({
				destination: './uploads',
				filename(_, file, callback)
				{
					const name = file.originalname;
					return callback(null, name);
				}
			})}
	))
	uploadFile(@UploadedFile() file) {
		return {
			url: `http://localhost:${process.env.BACKEND_PORT}/api/${file.path}`
		}
	}

	@Get('uploads/:path')
	async getImage(
		@Param('path') path,
		@Res() res: Response
	) {
		res.sendFile(path, {root: 'uploads'});
	}
}

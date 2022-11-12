import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
	constructor (private jwtService: JwtService) {

	}

	async userId(request: Request): Promise<number> {
		//console.log(request);
		const cookie = request.cookies['jwt'];
		console.log(cookie);

		const data = await this.jwtService.verifyAsync(cookie);

		return data['id'];
	}
}

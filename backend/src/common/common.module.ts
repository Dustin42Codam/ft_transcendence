import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

require("dotenv").config();

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '1d' },
		}),
	],
	exports: [JwtModule],
})
export class CommonModule {}

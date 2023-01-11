import { BadRequestException, Injectable, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AbstractService } from "src/common/abstract.service";
import { GameStatsCreateDto } from "src/games_stats/dto/gamestats-create.dto";
import { GameStats } from "src/games_stats/entity/game_stats.entity";
import { GameStatsService } from "src/games_stats/game_stats.service";
import { Repository } from "typeorm";
import { UserCreateDto } from "./dto/user-create.dto";
import { UserInfoDto } from "./dto/user-info.dto";
import { UserUpdateNameDto } from "./dto/user-update-name.dto";
import { User, UserStatus } from "./entity/user.entity";
import { TFA } from "src/tfa/entity/tfa.entity";
import { TFAService } from "src/tfa/tfa.service";
import * as bcrypt from 'bcrypt';
import experss, { Request } from "express";
import { Socket } from "socket.io";
import { parse } from "cookie";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService extends AbstractService {
  constructor(
    private gameStatsService: GameStatsService,
	@Inject(forwardRef(() => TFAService))
	private TFAService: TFAService,
    private jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

    async getUsers(relations?: any[]) {
        return await this.find(relations);
    }

  async getUserById(id: number, relations?: any[]) {
    const user = await this.findOne({ id }, relations);
    if (!user) throw new BadRequestException("This user does not exist");
    return user;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken: any = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
	  var user = await this.getUserById(userId, ["tfa_secret"]);
	  user.tfa_secret.twoFactorAuthenticationSecret = secret;
	  await this.userRepository.update(userId, user);
	  return user
    };

	async createUser(userCreateDto: UserCreateDto) {
		const newUserInfo: UserInfoDto = {status: UserStatus.ONLINE, ...userCreateDto}
		const all_users = await this.getUsers();
		var unique_name = false
		var i = 0
		var name: string
		while (!unique_name) {
			if (i === 0) {
				name = userCreateDto.display_name
			}
			else {
				name = userCreateDto.display_name + "-" + String(i)
			}
			unique_name = true
			for (const user of all_users) {
				if (user.display_name === name) {
					unique_name = false
				}
			}
		}
		newUserInfo.display_name = name;
		const newUser = await this.create(newUserInfo)
		console.log("🚀 ~ file: user.service.ts:70 ~ UserService ~ createUser ~ newUser", newUser)
		await this.gameStatsService.createGameStats(newUser);
		// await this.achievementService.createAllAchievements(newUser);
		const tfa_user = await this.getUserById(newUser.id, ["tfa_secret"])
		await this.TFAService.createTFA(tfa_user);
		return await this.getUserById(newUser.id, ["game_stats"]);
	}


	async updateUserName(user: User, userUpdateNameDto: UserUpdateNameDto) {
		const users = await this.getUsers();
		for (const user of users) {
			if (user.display_name === userUpdateNameDto.display_name)
				throw new BadRequestException("There is already a user with this displayname");
		}
		user.display_name = userUpdateNameDto.display_name;
		await this.userRepository.update(user.id, user);
		return user;
	}

	async changeStatus(id: number, status: UserStatus) {	
		const user = await this.getUserById(id);
		user.status = status;
		Object.assign(user, status);
		await this.userRepository.save(user);
		return user;
	}
	async getUserFromClient(client: Socket): Promise<number> {
		const cookie = parse(client.handshake.headers.cookie);
		const decoded = await this.jwtService.verifyAsync(cookie.jwt);
		return decoded.id;
	  }
}

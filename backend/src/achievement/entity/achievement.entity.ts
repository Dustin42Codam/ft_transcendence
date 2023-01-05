import { User } from "src/user/entity/user.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

export enum AchievementType {
  FRIENDS = 0,
  MESSAGES = 1,
  GAMES_PLAYED = 2,
  GAMES_WON = 3,
  ADDED_AVATAR = 4,
}

export class AchievementInfo {
  title: string;
  type: AchievementType;
  level_border: number[];
  max_level: number;
  // images: string[];
  level_name: string[];
}

export const achievements: AchievementInfo[] = [
  {
    title: "Friends",
    type: AchievementType.FRIENDS,
    max_level: 5,
    level_border: [0, 1, 5, 10, 25],
    level_name: ["Make a friend to get this achievement.", "First!", "starter", "Outrovert", "Social butterfly"],
  },
  {
    title: "Messages",
    type: AchievementType.MESSAGES,
    max_level: 5,
    level_border: [0, 1, 10, 20, 100],
    level_name: ["Send a message to get this achievement.", "level1", "level2", "level3", "level4"],
  },
  {
    title: "Games played",
    type: AchievementType.GAMES_PLAYED,
    max_level: 5,
    level_border: [0, 1, 5, 20, 50],
    level_name: ["Play a game to get this achievement.", "level1", "level2", "level3", "level4"],
  },
  {
    title: "Games Won",
    type: AchievementType.GAMES_WON,
    max_level: 5,
    level_border: [0, 1, 5, 10, 25],
    level_name: ["Win a game to get this achievement.", "level1", "level2", "level3", "level4"],
  },
  {
    title: "Added avatar",
    type: AchievementType.ADDED_AVATAR,
    max_level: 1,
    level_border: [0, 1],
    level_name: ["Change your avatar to get this achievement.", "level1"],
  },
];

@Entity("achievement")
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  level: number;

  @Column()
  type: AchievementType;

  @Column()
  max_level: number;

  @ManyToOne(() => User, (user: User) => user.achievements)
  user: User;
}

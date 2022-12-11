export enum UserRole {
  OWNER = "owner",
  ADMIN = "admin",
  USER = "user",
}

export enum UserStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  IN_A_GAME = "in_a_game",
}

export type User = {
  role: UserRole;
  muted: boolean;
  muted_unti: Date;
  banned: boolean;
  user_id: number;
  chatroom_id: number;
};

export class ChannelType {
  constructor(public id = 0, public type = "") {}
}

export enum ChatroomType {
  PUBLIC = "public",
  PROTECTED = "protected",
  PRIVATE = "private",
  DIRECT = "direct",
}

export type Messages = {
  content: string,
  date: Date,
	username: string
};


export class Chat {
  constructor(
    public id: number = 0,
    public name: string = "",
		public password: string = "",
    public type: ChatroomType = ChatroomType.PRIVATE,
    public users: User[] = [],
    public messages: Messages[] = []
  ) {}
}

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
  
  type User = {
	role: UserRole;
	muted: boolean;
	muted_unti: Date;
	banned: boolean;
	user_id: number;
	chatroom_id: number;
  };
  
  export enum ChatroomType {
	PUBLIC = "public",
	PROTECTED = "protected",
	PRIVATE = "private",
	DIRECT = "direct",
  }
  
  type Messages = {
	content: string;
	date: Date;
	type: ChatroomType;
  };
  
export class Channel {
	constructor(
		public id: number = 0,
		public name: string = '',
		public type: ChatroomType = ChatroomType.PRIVATE,
		public users: User[] = [],
		public messages: Messages[] = []
	) {}
};
  
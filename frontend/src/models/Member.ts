import { Chat } from "./Chats";

type User = {
  display_name: string;
  status: string;
  avatar: string;
  two_factor_auth: boolean;
};

export enum MemberRole {
  OWNER = "owner",
  ADMIN = "admin",
  USER = "user",
}

export type Member = {
  role: MemberRole;
  muted_until: Date;
  banned: boolean;
  user: User;
  chatroom: Chat;
};

import { Chat } from "./Chats";
import { User } from "./User";

// type User = {
//   id: number
//   display_name: string;
//   status: string;
//   avatar: string;
//   two_factor_auth: boolean;
// };

export enum MemberRole {
  OWNER = "owner",
  ADMIN = "admin",
  USER = "user",
}

export type Member = {
  id: number;
  role: MemberRole;
  muted_until: Date;
  banned: boolean;
  user: User;
  chatroom: Chat;
};

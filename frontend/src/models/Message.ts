import { Member } from "./Member";

export type Message = {
  member: Member;
  timestamp: Date;
  message: string;
};

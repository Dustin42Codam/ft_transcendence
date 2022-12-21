import { io, Socket } from "socket.io-client";
export class User {
  constructor(
    public chatSocketId: string,
    public gameSocketId: string,
    public id: number = -1,
    public display_name: string = "",
    public status: string = "",
    public avatar: string = "",
    public two_factor_auth: boolean = false
  ) {}
}

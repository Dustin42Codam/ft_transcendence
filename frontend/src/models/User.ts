export class User {
  constructor(
    public chatSocketId: string,
    public gameSocketId: string,
    public id: number = -1,
    public display_name: string = "",
    public intra_name: string = "",
    public status: string = "",
    public avatar: string = "",
    public two_factor_auth: boolean = false,
    public chatrooms: [],
    public send_blocks: [],
    public received_blocks: []
  ) {}
}

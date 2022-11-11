import { Member, MemberRole } from "src/member/models/member.entity";

export class MemberUpdateDto {
    role?: MemberRole;
    muted_until?: number;
    banned?: boolean;
}
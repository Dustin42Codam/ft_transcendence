import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity()
class Chat {
    @PrimaryColumn()
    public id: number;

    @Column()
    public name: string;

    // add protection for olny 3 possible choices
    @Column()
    public visibility: string;

    @Column("simple-array")
    public admin: string[];

    @Column("simple-array")
    public connectedUsers: string[];

    @Column("simple-array")
    public mutedUsers: string[];

    @Column("simple-array")
    public banendUsers: string[];

    @Column()
    public password: string; // hashed and salted
}

export default Chat;

import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity()
class Chat {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    // add protection for only 3 possible choices
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


// curl test query
// curl localhost:3000/chat -v -X POST -d "name=appels&password=aksdf2345&visibility=private&admin=testies&connectedUsers=me&mutedUsers=everyfuckingone&banendUsers=noone"
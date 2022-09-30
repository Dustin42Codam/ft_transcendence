import{ Entity, PrimaryGeneratedColumn, Column } from 'typeOrm';
@Entity()
class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public email: string;
    
    @Column()
    public password: string;
    
}

export default User;




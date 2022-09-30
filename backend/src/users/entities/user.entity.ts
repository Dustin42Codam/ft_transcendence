import{ Entity } from 'typeOrm';
@Entity()
class User {
    public email: string
    public password: string
}

export default User;




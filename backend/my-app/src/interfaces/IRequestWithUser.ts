import { Request } from 'express';
import User from './IUser';
 
interface RequestWithUser extends Request {
    user?: User;
}
 
export default RequestWithUser

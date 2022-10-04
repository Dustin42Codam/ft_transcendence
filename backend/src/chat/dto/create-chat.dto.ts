export class CreateChatDto 
{
    id: number;
    name: string;
    password: string; // hashed and salted
}
export default CreateChatDto;


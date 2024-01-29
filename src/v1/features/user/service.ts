import {User} from "./model";
import {Repository} from "../../utils/Repository";


export class UserService extends Repository<User, string> {
    override tableName: string = (User as any)._table_name;

    async findByEmail(value: string): Promise<User>{
        return this.findUniqueBy('email', value);
    }
}
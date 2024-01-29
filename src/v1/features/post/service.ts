import {Post} from "./model";
import {db} from "../../database";
import {Repository} from "../../utils/Repository";


export class PostService extends Repository<Post, string> {
    override tableName: string = (Post as any)._table_name;
}
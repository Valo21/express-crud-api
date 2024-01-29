import {randomUUID} from "crypto";
import {Entity} from "../../utils/decorators/Entity";


@Entity({
    table_name: 'posts'
})
export class Post {
    public id: string
    public content: string
    public author_id: string
    public created_at: Date
    public updated_at: Date


    constructor(content: string, author_id: string) {
        this.id = randomUUID();
        this.content = content;
        this.author_id = author_id;
        this.created_at = new Date(Date.now())
        this.updated_at = new Date(Date.now())
    }

}
import { BaseEntity } from "../../utils/BaseEntity";
import {randomUUID} from "crypto";
import {Entity} from "../../utils/decorators/Entity";

@Entity({
    table_name: 'users'
})
export class User {
    public id: string
    public name: string
    public lastname: string
    public email: string
    public password: string
    public created_at: Date
    public updated_at: Date
    constructor(name: string, lastname: string, email: string, password: string) {
        this.id = randomUUID();
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.created_at = new Date(Date.now());
        this.updated_at = new Date(Date.now());
    }
}
import { QueryResult, QueryResultRow} from "pg";
import { db } from "../database";
import { BaseEntity } from "./BaseEntity";
import {Post} from "../features/post/model";

export class Repository<T, I> {

    public tableName: string | undefined;

    async save(newEntity: T): Promise<T> {
        let queryString: string = `INSERT INTO ${this.tableName}`;
        const entityProps: string[] = [];
        const entityValues: any[] = [];

        let prop: keyof T;
        for (prop in newEntity) {
            entityProps.push(prop);
            entityValues.push(newEntity[prop]);
        }
        const queryProps = "(" + entityProps.join(", ") + ")";

        const result = await db.query(
            `INSERT INTO ${this.tableName} ${queryProps} VALUES (${entityValues.map((v, i) => '$'+ (i + 1))})`,
            entityValues
        )

        return newEntity;
    }

    async findAll(): Promise<T[]> {
        const res: QueryResult = await db.query(`SELECT * FROM ${this.tableName}`)
        return res.rows;
    }

    async findBy(propertyName: string, value: string): Promise<T[]>{
        const res: QueryResult = await db.query(`SELECT * FROM ${this.tableName} WHERE ${propertyName} = $1`, [value]);
        return res.rows || null;
    }

    async findUniqueBy(propertyName: string, value: string): Promise<T>{
        const res: QueryResult = await db.query(`SELECT * FROM ${this.tableName} WHERE ${propertyName} = $1`, [value]);
        return res.rows[0] || null;
    }

    async findById(value: string): Promise<T>{
        return this.findUniqueBy('id', value);
    }

    async delete(id: string): Promise<boolean>{
        const entity: T = await this.findById(id);
        if (!entity) {
            return false
        }
        const res: QueryResult = await db.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
        return true;
    }

    async update(id: string, props: Partial<T>): Promise<T>{
        let entityValues: any[] = [];
        let entityProps: string[] = [];
        for (const prop in props) {
            entityProps.push(`${prop} =`)
            entityValues.push(props[prop]);
        }
        entityProps = entityProps.map((value, i) => value + ' $' + (i + 2))
        const queryProps = entityProps.join(', ')

        const res = await db.query(`UPDATE ${this.tableName} SET ${queryProps} WHERE id = $1`, [id, ...entityValues])
        return res.rows[0] || null;
    }
}
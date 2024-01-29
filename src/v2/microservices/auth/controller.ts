import {RequestHandler, Request} from "express";
import { users as User } from '@prisma/client'
import bcrypt from 'bcrypt';
import { constants } from 'http2';
import db from "../../database";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";

const expirationTime = Number(process.env.JWT_DAYS_EXPIRATION) * 1000 * 60 * 60 * 24

function hasAllProperties<T extends Object>(obj: T, properties: (keyof T)[]): obj is T {
    return properties.every(prop => prop in obj);
}

export const signUp: RequestHandler<User> = async ( req: Request<User>, res) : Promise<void> => {
    const body = req.body;

    if (!hasAllProperties<User>(body, ['name', 'lastname', 'email', 'password'])) {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
            message: 'Missing data'
        })
        return;
    }

    const userExists: User | null = await db.users.findFirst({
        where: {
            email: body.email
        }
    })

    if (userExists){
        res.status(constants.HTTP_STATUS_CONFLICT).json({
            message: 'Email already in use'
        })
        return;
    }

    body.password = bcrypt.hashSync(body.password!, bcrypt.genSaltSync(10));

    const newUser = await db.users.create({
        data: {
            id: randomUUID(),
            name: body.name,
            lastname: body.lastname,
            email: body.email,
            password: body.password
        }
    })

    res.status(constants.HTTP_STATUS_OK).json({
        id: newUser.id
    })
    return;
}

export const signIn: RequestHandler<User> = async ( req: Request<User>, res) : Promise<void> => {
    const body = req.body;

    if (!hasAllProperties<User>(body, ['email', 'password'])) {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
            message: 'Missing data'
        })
        return;
    }

    const user: User | null = await db.users.findFirst({
        where: {
            email: body.email
        }
    })

    if (!user){
        res.status(constants.HTTP_STATUS_CONFLICT).json({
            message: 'Not registered email'
        })
        return;
    }

    if(!bcrypt.compareSync(body.password!, user.password!)){
        res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
            message: 'Incorrect password'
        })
        return;
    }

    const expiresIn : number = Date.now() * 1000 + expirationTime

    const token: string = jwt.sign({
        id: user.id
    }, process.env.SECRET!, {
        expiresIn
    })

    res
        .cookie('JwtToken', token, {httpOnly: true, maxAge: expirationTime})
        .status(constants.HTTP_STATUS_OK)
        .json({id: user.id} );
    return;
}
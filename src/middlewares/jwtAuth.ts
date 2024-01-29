import {RequestHandler} from "express";
import jwt, {JwtPayload, Secret} from 'jsonwebtoken'
import * as crypto from "crypto";
import {TokenPayload} from "../@types/auth";

const secretKey: string | undefined = process.env.SECRET;

function getKey(): Secret{
    return secretKey as Secret;
}

export const JwtAuthMiddleware:RequestHandler = (req, res, next) => {
    if (req.path.match(/^\/api\/v([1-9])\/auth/)) return next();

    const token: string | undefined = req.cookies['JwtToken'];
    if (!token) {
        res.send("Not logged in")
        return;
    }

    try{
        const jwtPayload: TokenPayload = jwt.verify(token, getKey()) as TokenPayload;
        res.locals.user = {
            id: jwtPayload.id
        };
        next();
    } catch (e) {
        res.send("Not logged in")
        return;
    }

};
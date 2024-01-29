import {RequestHandler} from "express";
import db from "../../database";
import {users as User} from "@prisma/client";
import {constants} from "http2";
import jwt from "jsonwebtoken";
import {TokenPayload} from "../../../@types/auth";

export const getUsers:RequestHandler = async (req, res, next) => {
    const users: User[] = await db.users.findMany();
    res
        .status(constants.HTTP_STATUS_OK)
        .json(users);
    return;
};

export const getUserById:RequestHandler = async (req, res, next) => {
    const user: User | null = await db.users.findUnique({
        where: {
            id: req.params.userId
        }
    })
    if (!user) {
        res
            .status(constants.HTTP_STATUS_NOT_FOUND)
            .json({
                message: 'User not found'
            });
    }
    res
        .status(constants.HTTP_STATUS_OK)
        .json(user);
    return;
};

export const getOwnUser:RequestHandler = async (req, res, next) => {
    const userId = res.locals.user.id;

    const user = await db.users.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true,
            lastname: true,
        }
    })
    if (!user) {
        res
            .status(constants.HTTP_STATUS_NOT_FOUND)
            .json({
                message: 'User not found'
            });
    }
    res
        .status(constants.HTTP_STATUS_OK)
        .json(user);
    return;
};
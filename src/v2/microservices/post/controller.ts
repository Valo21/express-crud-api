import {RequestHandler} from "express";
import db from "../../database";
import {posts as Post} from "@prisma/client";
import {constants} from "http2";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import {TokenPayload} from "../../../@types/auth";
import {PrismaClientKnownRequestError, PrismaClientUnknownRequestError} from "@prisma/client/runtime/library";

export const getPosts: RequestHandler = async (req, res) : Promise<void> =>{
    const posts: Post[] = await db.posts.findMany();
    res
        .status(constants.HTTP_STATUS_OK)
        .json(posts);
    return;
}

export const createPost: RequestHandler<Post> = async (req, res) : Promise<void> =>{
    const userId = res.locals.user.id;
    const body = req.body;

    const newPost: Post = await db.posts.create({
        data: {
            id: randomUUID(),
            content: body.content,
            users: {
                connect: {
                    id: userId
                }
            }
        }
    })

    res
        .status(constants.HTTP_STATUS_OK)
        .json({
            id: newPost.id
        });
    return;
}

export const getPostById: RequestHandler = async (req, res) : Promise<void> =>{
    const postId: string = req.params.postId;
    const post: Post | null= await db.posts.findUnique({
        where: {
            id: postId
        }
    })
    res
        .status(constants.HTTP_STATUS_OK)
        .json(post);
    return;
}

export const getOwnPosts: RequestHandler = async (req, res) : Promise<void> =>{
    const userId: string = res.locals.user.id;
    const posts: Post[] = await db.posts.findMany({
        where: {
            author_id: userId
        }
    })
    res
        .status(constants.HTTP_STATUS_OK)
        .json(posts);
    return;
}

export const patchOwnPost: RequestHandler = async (req, res) : Promise<void> =>{
    const userId: string = res.locals.user.id;
    const body: Post = req.body;

    const post: Post = await db.posts.update({
        data: {
            content: body.content
        },
        where: {
            id: req.params.postId,
            author_id: userId
        }
    })
    res
        .status(constants.HTTP_STATUS_OK)
        .json({
            id: post.id
        });
    return;
}

export const deleteOwnPost: RequestHandler = async (req, res) : Promise<void> =>{
    const userId: string = res.locals.user.id;

    // @ts-ignore
    try {
        const post: Post = await db.posts.delete({
            where: {
                id: req.params.postId,
                author_id: userId
            }
        })
        res
            .status(constants.HTTP_STATUS_OK)
            .json({
                id: post.id
            });
        return;
    } catch (err: unknown) {
        if (err instanceof PrismaClientKnownRequestError) {
            res
                .status(constants.HTTP_STATUS_OK)
                .json({
                    message: err.meta!.cause
                });
        }
    }

}
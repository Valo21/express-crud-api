import {RequestHandler} from "express";
import {constants} from "http2";
import {Post} from "./model";
import {PostService} from "./service";

const postService: PostService = new PostService();

export const getPosts: RequestHandler = async ( req, res): Promise<void> => {
    const posts: Post[] = await postService.findAll();
    res
        .status(constants.HTTP_STATUS_OK)
        .json(posts);
    return;
}

export const getPostById: RequestHandler = async ( req, res): Promise<void> => {
    const postId: string = req.params.postId;
    const post: Post = await postService.findById(postId);

    res
        .status(constants.HTTP_STATUS_OK)
        .json(post);
    return;
}

export const creatPost: RequestHandler<Post> = async (req, res): Promise<void> => {
    const userId = res.locals.user.id;
    const content = req.body.content;

    const newPost = await postService.save(new Post(content, userId));

    res
        .status(constants.HTTP_STATUS_OK)
        .json({
            id: newPost.id
        })
}

export const getOwnPosts: RequestHandler = async ( req, res, next): Promise<void> => {
    if (req.params.postId !== 'me'){
        next();
    }
    const userId = res.locals.user.id;
    const posts: Post[] = await postService.findBy('author_id', userId);

    res
        .status(constants.HTTP_STATUS_OK)
        .json(posts);
    return;
}

export const deleteOwnPost: RequestHandler = async ( req, res): Promise<void> => {
    const postId: string = req.params.postId;
    const deleted: boolean = await postService.delete(postId);

    if (!deleted) {
        res
            .status(constants.HTTP_STATUS_CONFLICT)
            .json({
                message: 'Incorrect Id'
            });
        return;
    }

    res
        .status(constants.HTTP_STATUS_ACCEPTED)
        .json(true);
    return;
}

export const patchOwnPost: RequestHandler = async (req, res): Promise<void> => {
    const postId: string = req.params.postId;
    const content = req.body.content;

    const updatedPost = await postService.update(postId, {
        content
    })

    res
        .status(constants.HTTP_STATUS_OK)
        .json({
            id: postId
        })
}
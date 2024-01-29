import express, {Router} from "express";
import {creatPost, getPostById, getPosts, getOwnPosts, deleteOwnPost, patchOwnPost} from "./controller";
const router: Router = express.Router();

router.get('/', getPosts);
router.post('/', creatPost);

router.get('/:postId', getOwnPosts, getPostById);
router.delete('/me/:postId', deleteOwnPost);
router.patch('/me/:postId', patchOwnPost);

export default router;
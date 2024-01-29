import express, {Router} from "express";
import {getPosts, createPost, getOwnPosts, patchOwnPost, deleteOwnPost, getPostById} from "./controller";
const router: Router = express.Router();

router.get('/', getPosts)
router.post('/', createPost)

router.post('/:postId', getPostById)

router.get('/me', getOwnPosts);
router.patch('/me/:postId', patchOwnPost);
router.delete('/me/:postId', deleteOwnPost)
export default router;
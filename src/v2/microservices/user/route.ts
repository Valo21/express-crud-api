import express, {Router} from "express";
import {getUsers, getOwnUser, getUserById} from "./controller";
const router: Router = express.Router();

router.get('/', getUsers)
router.get('/:userId', getUserById)
router.get('/me', getOwnUser)
export default router;
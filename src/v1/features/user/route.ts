import express, {Router} from "express";
import {createUser} from "./controller";
const router: Router = express.Router();

router.post('/', createUser)
export default router;
import dotenv from "dotenv";
dotenv.config();

import express, { Express } from 'express';

import CookieParser from 'cookie-parser';
import BodyParser from "body-parser";
import {JwtAuthMiddleware} from "./middlewares/jwtAuth";

import UsersRoute from './v1/features/user/route'
import AuthRouteV1 from './v1/features/auth/route'
import PostsRouteV1 from './v1/features/post/route'

import AuthRouteV2 from './v2/microservices/auth/route'
import UsersRouteV2 from './v2/microservices/user/route'
import PostsRouteV2 from './v2/microservices/post/route'

const app: Express = express();
const port: number = Number(process.env.PORT) || 3400;

//Middlewares
app.use(CookieParser());
app.use(BodyParser.json())
app.use(JwtAuthMiddleware);

//Routes
app.use('/api/v1/users', UsersRoute);
app.use('/api/v1/auth', AuthRouteV1);
app.use('/api/v1/posts', PostsRouteV1);

app.use('/api/v2/users', UsersRouteV2);
app.use('/api/v2/auth', AuthRouteV2)
app.use('/api/v2/posts', PostsRouteV2)


app.listen(port,() : void =>{
    console.log("App listening at port " + port);
});
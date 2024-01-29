import {RequestHandler} from "express";
import {User} from "../user/model";
import {UserService} from "../user/service";
import {constants} from "http2";
import bcrypt, {genSaltSync} from "bcrypt";
import jwt from "jsonwebtoken";

const expirationTime = Number(process.env.JWT_DAYS_EXPIRATION) * 1000 * 60 * 60 * 24

const userService: UserService = new UserService();
export const signUp: RequestHandler<User> = async ( req, res): Promise<void> => {
    const body: User = req.body;
    const userExists: User = await userService.findByEmail(body.email);

    if (userExists) {
        res
            .status(constants.HTTP_STATUS_CONFLICT)
            .json({
                message: 'Email already in use'
            })
        return;
    }

    body.password = bcrypt.hashSync(body.password, genSaltSync(10));

    const newUser: User = new User(body.name, body.lastname, body.email, body.password);

    await userService.save(newUser);

    res
        .status(constants.HTTP_STATUS_OK)
        .json({
            id: newUser.id
        })
    return;
}

export const signIn: RequestHandler<User> = async ( req, res): Promise<void> => {
    const body: User = req.body;
    const user: User = await userService.findByEmail(body.email);
    if (!user) {
        res
            .status(constants.HTTP_STATUS_CONFLICT)
            .json({
                message: 'No user with that email'
            })
        return;
    }

    if (!bcrypt.compareSync(body.password, user.password)) {
        res
            .status(constants.HTTP_STATUS_CONFLICT)
            .json({
                message: 'Incorrect password'
            })
        return;
    }

    const expiresIn: number = Date.now() * 1000 + expirationTime;

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
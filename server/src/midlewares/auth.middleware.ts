import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { User } from '../models/user.model';
import { FullnameShape } from '../interfaces/user.interface';


interface JWTPayload {
    _id: string;
    fullname: FullnameShape;
    email: string;
    iat: number;
    exp: number;

}
const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];
    console.log("accessToken", accessToken)
    if (!accessToken) {
        throw new ApiError(401, "Unauthorized user")
    }
    const decodedToken = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET!) as JWTPayload
    console.log("decodedToken", decodedToken)
    if (!decodedToken) {
        throw new ApiError(402, "Unauthorized user")
    }

    const user = await User.findById(decodedToken._id)
    req.user = user;
    next()
})

export { verifyJWT }
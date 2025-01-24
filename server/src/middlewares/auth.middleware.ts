import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { User } from '../models/user.model';
import { FullnameShape } from '../interfaces/user.interface';
import { Captain } from '../models/captain.model';


const verifyJWTForUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];
    console.log("accessToken", accessToken)
    if (!accessToken) {
        throw new ApiError(401, "Unauthorized user")
    }
    const decodedToken = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET!) as JwtPayload
    console.log("decodedToken", decodedToken)
    if (!decodedToken) {
        throw new ApiError(402, "Unauthorized user")
    }

    const user = await User.findById(decodedToken._id)
    req.user = user;
    next()
})


const verifyJWTForCaptain = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ", "")

    if (!accessToken) {
        throw new ApiError(401, "Unauthorized Captain")
    }

    const decodedCaptain = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET!) as JwtPayload

    if (!decodedCaptain) {
        throw new ApiError(401, "Unauthorized Captain")
    }
    const captain = await Captain.findById(decodedCaptain._id)

    if (!captain) {
        throw new ApiError(401, "No captain found with decoded CaptainId")
    }

    req.captain = captain;
    next();

})

export { verifyJWTForUser,verifyJWTForCaptain }
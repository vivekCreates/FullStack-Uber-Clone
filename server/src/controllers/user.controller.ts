import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { User, UserShape } from '../models/user.model';
import { ApiResponse } from '../utils/ApiResponse';
import { generateAccessAndRefreshTokens } from '../utils/generateTokens';

interface Options {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "strict" | "none" | "lax";
}

const options:Options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
}

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    console.log(req.body)

    const { fullname, email, password } = req.body;
    const { firstname, lastname } = fullname;

    if (!fullname || !email || !password) {

        throw new ApiError(404, "All fields are required.")

    }

    const existedUser = await User.findOne({ email })
    if (existedUser) {

        throw new ApiError(400, "User already exists")

    }

    const createdUser = await User.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    })

    if (!createdUser) {

        throw new ApiError(401, "user not registered")

    }

    res.json(
        new ApiResponse(
            201,
            createdUser,
            "User registered successfully",
        )
    )
})

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {

        throw new ApiError(
            400,
            "All field are required"
        )
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(
            401,
            "user does not exist"
        )
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    console.log("isPasswordValid",isPasswordValid)
    if (!isPasswordValid) {
        throw new ApiError(
            400,
            "email or password is incorrect"
        )

    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user?._id)

    if (!(accessToken|| refreshToken)) {
        throw new ApiError(400, "token not generated")
    }

    return res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            user,
            accessToken,
            refreshToken
        }, "user login successfully"))
})


const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new ApiError(404, "user not found")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken:1
            }
        },
        {new:true}
     )
    res
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(
            200,
            user,
            "user logout successfully"
        )
    )
})


export {
    registerUser,
    loginUser,
    logoutUser
}
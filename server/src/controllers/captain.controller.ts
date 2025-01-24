import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { Captain } from "../models/captain.model";
import { ApiResponse } from "../utils/ApiResponse";
import { generateAccessAndRefreshTokensForCaptain } from "../utils/generateTokens";
import { options } from './user.controller';



const registerCaptain = asyncHandler(async (req: Request, res: Response) => {
    const { fullname, email, password, vehicle } = req.body;
    const { firstname, lastname } = fullname;
    const { color, plate, capacity, vehicleType } = vehicle;

    if ([firstname, email, password, color, plate, capacity].some(field => field === "")) {
        throw new ApiError(400, "All fields are required.")
    }

    const existedCaptain = await Captain.findOne({ email })

    if (existedCaptain) {
        throw new ApiError(400, "captain already exists")
    }

    const captain = await Captain.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        },
    })

    if (!captain) {
        throw new ApiError(400, "captain not registered")
    }

    res
        .json(
            new ApiResponse(
                201,
                captain,
                "captain registered successfully"
            )
        )
})

const loginCaptain = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!(email || password)) {
        throw new ApiError(400, "All fields are required")
    }

    const captain = await Captain.findOne({ email })

    if (!captain) {
        throw new ApiError(400, "captain does not exists")
    }

    const isPasswordValid = await captain.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(400, "email or password is incorrect")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokensForCaptain(captain._id)
    if (!(accessToken || refreshToken)) {
        throw new ApiError(400, "Token not generation while trying login to captain")
    }

    return res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                captain,
                accessToken,
                refreshToken
            },
                "Captain login successfully"
            ))
})

const logoutCaptain = asyncHandler(async (req: Request, res: Response) => {
    const captain = await Captain.findByIdAndUpdate(
        req.captain._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        { new: true })

    return res
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                captain,
                "captain logout successfully"
            )
        )

})

const getCaptainProfile = asyncHandler(async(req:Request,res:Response)=>{
    const captain = await Captain.findById(req.captain._id)

    if(!captain){
        throw new ApiError(400,"No captain profile found")
    }

    return res.json(
        new ApiResponse(
            200,
            captain,
            "Captain profile fetched successfully"
        )
    )
})

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(400, "No refresh token found")
    }

    const decodedCaptain = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_TOKEN_SECRET!) as JwtPayload

    const captain = await Captain.findById(decodedCaptain._id)

    if (!captain) {
        throw new ApiError(400, "No Captain found with decoded CaptainId while refreshing the accessToken")
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokensForCaptain(decodedCaptain._id)
    return res
        .json(
            new ApiResponse(
                200,
                {
                    accessToken, refreshToken: newRefreshToken
                },
                "Access and Refresh Token successfully"
            )
        )
})



export {
    registerCaptain,
    loginCaptain,
    logoutCaptain,
    getCaptainProfile,
    refreshAccessToken
}
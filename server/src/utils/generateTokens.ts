import { Captain } from "../models/captain.model";
import { User } from "../models/user.model";

export interface TokensMethods {
    accessToken: string;
    refreshToken: string;
}

const generateAccessAndRefreshTokensForUser = async (userId: string): Promise<TokensMethods> => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        if (refreshToken) {
            user.refreshToken = refreshToken;
        }

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error: any) {
        console.error("Error generating tokens:", error.message || error);
        throw new Error("Failed to generate tokens");
    }
};

const generateAccessAndRefreshTokensForCaptain = async (captainId: string): Promise<TokensMethods> => {
    try {
        const captain = await Captain.findById(captainId);
        if (!captain) {
            throw new Error("Captain not found");
        }

        const accessToken = captain.generateAccessToken();
        const refreshToken = captain.generateRefreshToken();

        if (refreshToken) {
            captain.refreshToken = refreshToken;
        }

        await captain.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error: any) {
        console.error("Error generating tokens:", error.message || error);
        throw new Error("Failed to generate tokens");
    }
};

export {
    generateAccessAndRefreshTokensForUser,
    generateAccessAndRefreshTokensForCaptain
}

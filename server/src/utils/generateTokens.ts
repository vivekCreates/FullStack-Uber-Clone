import { User } from "../models/user.model";

export interface TokensMethods {
    accessToken: string;
    refreshToken: string;
}

const generateAccessAndRefreshTokens = async (userId: string): Promise<TokensMethods> => {
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
    } catch (error:any) {
        console.error("Error generating tokens:", error.message || error);
        throw new Error("Failed to generate tokens");
    }
};

export { generateAccessAndRefreshTokens };

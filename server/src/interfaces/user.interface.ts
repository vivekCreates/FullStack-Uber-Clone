import mongoose,{Document} from "mongoose";



export interface FullnameShape {
    firstname: string;
    lastname: string;
}

export interface UserShape extends Document {
    _id: string;
    fullname: FullnameShape;
    email: string;
    password: string;
    socketId: string;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
    isModified: (path: string) => boolean; 
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken():string;
    generateRefreshToken():string;
}

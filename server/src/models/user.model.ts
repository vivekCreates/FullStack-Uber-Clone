import mongoose, { Schema, Model, model } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { UserShape } from "../interfaces/user.interface";



const userSchema: Schema = new Schema<UserShape>({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, "firstname must be atleast 3 characters."]
        },
        lastname: {
            type: String,
            required: true
        }
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "password must be atleast characters."]
    },
    socketId: {
        type: String,
        default: ""
    },
    refreshToken: {
            type: String,
            default: ""
        }       

}, { timestamps: true })




userSchema.pre<UserShape>("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);   
    next();
});

userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken =  function ():string{
    const token =  jwt.sign({
        _id: this._id,
        fullname: this.fullname,
        email: this.email,
        password: this.password
    },
        process.env.JWT_TOKEN_SECRET!,
        {
            expiresIn: process.env.JWT_TOKEN_EXPIRY as string
        })
        return token
}
userSchema.methods.generateAccessToken =  function ():string{
    const accessToken =  jwt.sign({
        _id: this._id,
        fullname: this.fullname,
        email: this.email
    },
        process.env.JWT_ACCESS_TOKEN_SECRET!,
        {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY as string
        })
        return accessToken
}
userSchema.methods.generateRefreshToken =  function ():string{
    const refreshToken =  jwt.sign({
        _id: this._id,
    },
        process.env.JWT_REFRESH_TOKEN_SECRET!,
        {
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY as string
        })
        return refreshToken
}


export const User: Model<UserShape> = model<UserShape>("User", userSchema);
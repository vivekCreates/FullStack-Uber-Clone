import mongoose, { Document, Schema, Model, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { CaptainShape, StatusEnum, VehicleEnum } from "../interfaces/captain.interface";



const captainSchema: Schema = new Schema<CaptainShape>({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, "Lastname must be at least 3 characters long"],
        },
        lastname: {
            type: String,
            required: true,
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    socketId: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: Object.values(StatusEnum),
        default:StatusEnum.INACTIVE
    },
    vehicle:{
        color:{
            type:String,
            required:true
        },
        plate:{
            type:String,
            required:true
        },
        capacity:{
            type:Number,
            required:true
        },
        vehicleType:{
            type:String,
            enum:Object.values(VehicleEnum),
            required:true
        },
    },
    location: {
        ltd: {
            type: Number,
            default:null
        },
        lng: {
            type: Number,
            default:null
        }
    },
    refreshToken:{
        type:String,
        default:""
    }
}, { timestamps: true });



captainSchema.pre<CaptainShape>("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

captainSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
}

captainSchema.methods.generateAccessToken = function (): string {
    const token = jwt.sign({
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
captainSchema.methods.generateAccessToken = function (): string {
    const accessToken = jwt.sign({
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
captainSchema.methods.generateRefreshToken = function (): string {
    const refreshToken = jwt.sign({
        _id: this._id,
    },
        process.env.JWT_REFRESH_TOKEN_SECRET!,
        {
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY as string
        })
    return refreshToken
}


export const Captain:Model<CaptainShape> = model<CaptainShape>("Captain",captainSchema)
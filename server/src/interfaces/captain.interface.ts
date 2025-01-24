import mongoose,{Document} from "mongoose";
import { FullnameShape, UserShape } from "./user.interface";

export enum StatusEnum {
    ACTIVE = "active",
    INACTIVE = "inactive",

}
export enum VehicleEnum {
 CAR="car",
 MOTORCYCLE="motorcycle",
 AUTO="auto"
}

export interface VehicleShape {
color:string;
plate:string;
capacity:number;
vehicleType:VehicleEnum
}
export interface Location {
    ltd: number;
    lng: number;
}
export interface CaptainShape extends Document {
    _id:string;
    fullname: FullnameShape;
    email: string;
    password: string;
    socketId: string;
    status: StatusEnum;
    capacity:number;
    vehicle:VehicleEnum;
    location: Location;
    refreshToken:string;
    isModified: (path: string) => boolean; 
    isPasswordCorrect:(password:string)=>Promise<Boolean>;
    generateAccessToken:()=>string;
    generateRefreshToken:()=>string;

}
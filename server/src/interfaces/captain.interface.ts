import mongoose,{Document} from "mongoose";
import { FullnameShape } from "./user.interface";

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
    fullname: FullnameShape;
    email: string;
    password: string;
    socketId: string;
    status: StatusEnum;
    vehicle:VehicleEnum;
    location: Location;
    refreshToken:String
;}
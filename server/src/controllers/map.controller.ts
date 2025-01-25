import axios from "axios";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";



const getCoordinates = asyncHandler(async(req:Request,res:Response)=>{
 const {destination,origin} = req.query ;
 if (!destination || !origin) {
    throw new ApiError(404, "All fields are required.")
    
 }
 const URL = `https://maps.gomaps.pro/maps/api/distancematrix/json?destinations=${destination}&origins=${origin}&key=${process.env.GOAPI_API_KEY}`
 const response = await axios.get(URL);

 if (response.status !== 200) {
    throw new ApiError(400, "Error while fetching coordinates data from go api")
 }

 return res.json(
    new ApiResponse(
        200,
        {
            data: response.data
        },
        "Coordinates fetched successfully",
    )
 )

})



const getSuggestedPlaces= asyncHandler(async(req:Request,res:Response)=>{
 const {input} = req.query ;
 if (!input) {
    throw new ApiError(404, "input is required.")
    
 }
 const URL = `https://maps.gomaps.pro/maps/api/place/queryautocomplete/json?input=${input}&key=${process.env.GOAPI_API_KEY}`
 const response = await axios.get(URL);

 if (response.status !== 200) {
    throw new ApiError(400, "Error while fetching suggested Places data from go api")
 }

 return res.json(
    new ApiResponse(
        200,
        {
            data: response.data
        },
        "Suggested places fetched successfully",
    )
 )

})


export {
    getCoordinates,
    getSuggestedPlaces
}
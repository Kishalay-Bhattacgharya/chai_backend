import { asyncHandler } from "../utils/asyncHandler.js";

export const registerUser=asyncHandler(async (request,response)=>{
   response.status(200)
           .json({message:"Hey! I am Kishalay"})
})

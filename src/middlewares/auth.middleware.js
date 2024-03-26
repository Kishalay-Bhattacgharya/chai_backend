import  jwt  from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { APIError } from "../utils/apiError.js";
//pls note that sometimes when we dont use the res paramter in callback function we can replace it with _
export const verifyJwt=asyncHandler(async (req,_,next)=>{
  //We are using cookie parser middleware so request obj also have cookie information just like response object
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

        // console.log(token);
        
    
        if(!token)
          throw new APIError(401, "Unauthoized request")
        //To get info of the user out of the accesstoken
    
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)  
        //console.log(decodedToken);
    
        const user=await User.findById(decodedToken?._id).select("-password -refreshtoken")//dont need password and refreshtoken to be passed with request object
       //console.log(user);
        if(!user)
         {
            throw new APIError(401,"Invalid Access Token")
         }
    
         req.user=user
         next()
    } catch (error) {
        throw new APIError(401,error?.message ||"Invalid access token")
    }

})
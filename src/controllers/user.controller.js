import { APIError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { uploadFileOnCloudinary } from "../utils/fileupload.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const registerUser=asyncHandler(async (request,response)=>{
   //get user details from frontend
   //validation
   //check if user already exists:username, email
   //check for images, avatar
   //upload images to cloudinary and store link/url provided to database, also need tocheck if avatar has been uploaded in cloudinary or not
   //create user object-create entry in db
   //remove p/w ,refresh token from response
   //check for user creation or if there is error happeningin the process
   //return res
  
    const { username,email,password,fullname }=request.body
    

    if([username,email,password,fullname].some((field)=>field?.trim()===undefined))
      {
         throw new APIError(400,"All fields are required")
      }
    if(password.length<8)
      return new APIError("Password cannot be less than 8 characters")
    if(!email.includes("@"))
      return new APIError(400,"Email id must include @ in it")
  //to check if user is already in the db
    const userExists= await User.findOne({
        $or:[{ username },{ email }]
    })
    
    if(userExists)
       throw new APIError(409,"User with username or email already exists!")
    //To check if the image given by user is uploaded to local path or not
    if(Object.keys(request.files).findIndex((key) => key==="avatar")===-1)
       throw new APIError(400,"Avatar image is required!")
       const avatarLocalPath =request.files?.avatar[0]?.path
       const avatar= await uploadFileOnCloudinary (avatarLocalPath)
    
    let coverImage
    if(Object.keys(request.files).findIndex((key) => key==="coverImage")!==-1){
      const coverImageLocalPath=request.files?.coverImage[0]?.path
      coverImage =await uploadFileOnCloudinary (coverImageLocalPath)
    }
      

    if(!avatar)
       throw new APIError(400,"Avatar image is required!") 
   
    //To create an entry in the mongodb,it takes time since it is communicating with db
     const user =await User.create(
        {
                username:username.toLowerCase(),
                email,
                password,
                fullname,
                avatar:avatar.url,
                coverimage:coverImage?.url || ""
        }
     )  

     const createdUser=await User.findById(user._id).select("-password -refreshtoken")
     if(!createdUser){
        throw new APIError(500,"something wrong while registering the user")
     }

     return response.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
     )

})

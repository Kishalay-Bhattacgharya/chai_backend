import { APIError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { uploadFileOnCloudinary } from "../utils/fileupload.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

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
    
   //Some method checks and returns falls if atleast one item in the array does not satisfy the condition given in the callback
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


export const loginUser=asyncHandler(async(req,res)=>{
  //Take user inputs of username ,email, password from frontend
  //check these against the information of documents in mongodb
  //if matches, then give a success else throw username or password is incorrect
  //generate the acess token and also send this info , do similar activity for refresh token as well
  //send the above token info in secure cookies
  const {username,email,password}=req.body//object destructure
  console.log(username);
  if(!username || !email)
   throw new APIError (400,"Username or email is required")

   const user= await User.findOne({
      $or:[{username},{email}]
   })

   //console.log(user);
   if(!user){
      throw new APIError(404,"User does not exist")
   }

   if(!await user.isPasswordCorrect(password))
    throw new APIError(401,"Password incorrect-invalid user credentials")
 
   const {accessToken, refreshToken}=await generateAcessAndRefreshTokens(user._id)
   user.refreshtoken=refreshToken
   
   //console.log(user);
   const loggedInUser=await User.findOne(user._id).select(" -password -refreshtoken")
   const options={
      httpOnly:true,
      secure:true
   }
  //How to send cookie to user browser
   return res.status(200)
             .cookie("accessToken",accessToken,options)
             .cookie("refreshToken",refreshToken,options)
             .json(
               new ApiResponse(
                  200,
                  {
                     loggedInUser,accessToken,refreshToken
                  },
                  "User logged in successfully!"
               )
             )
   
})


export const logoutUser=asyncHandler(async(req,res)=>{
  
   await User.findByIdAndUpdate(req.user._id,{
      $set:{
         refreshtoken:undefined//Delete the value in refreshtoken field
      }
   },
   {
      new:true
   })
   
   const options={
      httpOnly:true,
      secure:true
   }

   //2nd step: clear cookies stored in user browser
   return res.status(200)
             .clearCookie("accessToken",options)
             .clearCookie("refreshToken",options)
             .json(
               new ApiResponse(200,{},"User has been logged out")
             )


})
const generateAcessAndRefreshTokens=async(userId) =>{
  try {
   const user=await User.findById(userId)
   console.log(user);
   const accessToken=user.generateAccessToken()
   const refreshToken=user.generateRefreshToken()
   user.refreshtoken=refreshToken
   await user.save({validateBeforeSave:false})

   return {accessToken ,refreshToken}
  } catch (error) {
   throw new APIError(500,"Something went wrong while generating refresh and access tokens")
  }
}

export const refreshAccessToken=asyncHandler(async(req,res)=>{
 

   const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken

   if(!incomingRefreshToken){
      throw new APIError(401,"Unauthroized request")
   }
   
   const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

   const user=await User.findById(decodedToken?._id)

   if(!user)
    throw new APIError(401,"Invalid refresh token!")
   //To check if the refreshtoken with which user is trying to login, is same with the one in the database
   if(incomingRefreshToken!==user?.refreshToken)
    throw new APIError(401,"Refresh Token has been expired ")

    const {accesToken,refreshToken}=await generateAcessAndRefreshTokens(user._id)

    const cookieOptions={
      httpOnly:true,
      secure:true
    } 

    return res.status(200)
              .cookie("AccesToken",accesToken,cookieOptions)
              .cookie("RefreshToken",refreshToken,cookieOptions)
              .json(
               new ApiResponse(
                  200,
                  {accesToken,refreshToken},"New AcessToken has been assigned!"

               )
              )

})
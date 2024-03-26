import mongoose, {Schema} from "mongoose"//object de structure
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
 
const userSchema=new Schema({
  username:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    index:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    
  },
  fullname:{
    type:String,
    required:true,
    trim:true,
    index:true
  },
  avatar:{
    type: String,//cloudinary url, we can also use other third party service to keep pictures, videos
    required:true
  },
  coverimage:{
    type:String
  },
  watchHistory:[
    {
    type:Schema.Types.ObjectId,
    ref:"Video"
    }
  ],
  password:{
    type:String,
    required:[true, "Password is required"]
  },
  refreshtoken:{
        type:String
    }
  
},{timestamps:true})

userSchema.pre("save", async function(next) {
    if(!this.isModified("password"))
    return next()//To avoid problem of doing hashing everytime user updates his profile or something
    this.password=await bcrypt.hash(this.password,10)
    next()//--> Since pre hook is a middleware, so we have passed reference of next method from within pre function 
})
//To add our own custom logics we can use methods property of schema object or we can also configure it using Schema.prototype.method method
userSchema.methods.isPasswordCorrect= async function(password){
 return await bcrypt.compare(password, this.password)

}
userSchema.methods.generateAccessToken=function(){
  
  return jwt.sign(
    {
      _id:this._id,
      username:this.username,
      fullname:this.fullname,
      email:this.email
    },process.env.ACCESS_TOKEN_SECRET,{
      expiresIn:process.env.Access_token_expiry
    }
  )
}

userSchema.methods.generateRefreshToken=function(){
  return jwt.sign(
    {
      _id:this._id,
    },process.env.REFRESH_TOKEN_SECRET,{
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const User=mongoose.model("User",userSchema)

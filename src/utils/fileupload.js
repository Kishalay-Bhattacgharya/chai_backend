import {v2 as cloudinary} from "cloudinary"//Object destructure
import fs from "node:fs"

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET 
})

const uploadFileOnCloudinary=async (localFilePath)=>{

    try {
        if(!localFilePath)
        throw new Error("Could not find the filepath")
        const response=await cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto"
    } )

    return response
    } catch (error) {
        console.log(`error is ${error}`)
        fs.unlinkSync(localFilePath)

    }
}
export {uploadFileOnCloudinary}

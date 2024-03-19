
//require('dotenv').config({path:"./env"})
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import app from "./app.js"



dotenv.config({
  path:"./env"
})

connectDB()
.then( ()=>{
  app.listen(process.env.PORT || 8000,()=>{
    console.log(`Server is running at port : ${process.env.PORT}`);
  })
})
.catch((error) =>{
  console.log("MongoDB connection failed!");
})




// function connectDB(){
/*
// }
//IIFE
//Use try catch async await as we need to give some time to connect to db or should be ready if we get any error
(async () =>{
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`)
  } catch (error) {
    console.log(`Error : ${error}`)
    throw error
  }
})()

*/
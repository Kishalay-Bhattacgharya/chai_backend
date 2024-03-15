
//require('dotenv').config({path:"./env"})
import dotenv from "dotenv"
import connectDB from "./db/index.js"



dotenv.config({
  path:"./env"
})

connectDB()




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
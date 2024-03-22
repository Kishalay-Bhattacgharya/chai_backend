import express from "express"
//cors stands for cross origin resource sharing
import cors from "cors"
import cookieParser from "cookie-parser"

 const app=express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,

}))

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))//To parse data coming from url
app.use(express.static("public"))
app.use(cookieParser())



//routes

import  userRouter  from "./routes/user.routes.js"
//We can use any name since this routes.js has router functionality exported as default
//Since we have seperated router object from express, we need to use it as a middleware




app.use("/api/v1/users",userRouter)//To define api and what version it is now



//http:localhost:3000/users/register
export {app}

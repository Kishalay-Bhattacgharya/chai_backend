import express from "express"
//cors stands for cross origin resource sharing
import cors from "cors"
import cookieParser from "cookie-parser"

export const app=express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,

}))

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))//To parse data coming from url
app.use(express.static("public"))
app.use(cookieParser())

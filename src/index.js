import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path : './env'
});

connectDB()
.then(()=>{
   app.listen(process.env.PORT || 8080 , ()=>{
    console.log(`sever is running at port ${process.env.PORT} `)
   })
})
.catch((error)=>{
    console.log("mongodb connection error")
})
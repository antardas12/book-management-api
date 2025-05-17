import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "17kb" }));
app.use(express.urlencoded({ extended: true, limit: "17kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.route.js";
import bookRouter from "./routes/book.routes.js"
app.use("/api/v1/user",userRouter);
app.use("/api/v1/book",bookRouter);

import errorHandler from "./middelweres/error.middelwere.js";


// app.use(errorHandler)
export { app };

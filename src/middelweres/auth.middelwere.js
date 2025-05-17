import { User } from "../model/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandle } from "../utils/asynHandel.js";
import jwt from "jsonwebtoken";
export const verifyJWT = asyncHandle(async (req, __, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("authorization")?.replace("bearer ", "");
    if (!token) {
      throw new ApiError(400, "unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(400, "invalid accessToken");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(400, error.message || "invalid accessToken");
  }
});

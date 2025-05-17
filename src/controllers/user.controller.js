import { User } from "../model/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandle } from "../utils/asynHandel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessTokenAndRefreshToken = async (uid) => {
 try {
   const user = await User.findById(uid);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
 } catch (error) {
  throw new ApiError(400, "some error while create the access and refresh token")
 }
};

const registerUser = asyncHandle(async (req, res) => {
  const { name, email, password } = req.body;
  if ([email, password, name].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "all filed are required ");
  }

  const existUser = await User.findOne({ email });
  if (existUser) {
    throw new ApiError(400, "user with this email all ready register ");
  }

  const localFilePath = req.file.path;

  if (!localFilePath) {
    throw new ApiError(404, "avatar are required");
  }
  const avatar = await uploadOnCloudinary(localFilePath);
  if (!avatar) {
    throw new ApiError(500, "some error while upload file on cloudinary");
  }

  const user = await User.create({
    name,
    password,
    email,
    avatar: avatar.url,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "some internal error while register the user ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "user register successfully ", createdUser));
});

const loginUser = asyncHandle(async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    throw new ApiError(401, "email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "user are not register in our system ");
  }

  const validPassword = await user.isPasswordCorrect(password);
  console.log(validPassword);
  if (!validPassword) {
    throw new ApiError(403, "give the valid password");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const logedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "user login successfully", {
        user: logedInUser,
        accessToken,
        refreshToken,
      })
    );
});

const logOutUser = asyncHandle(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options ={
    httpOnly : true,
    secure : true
  }

  return res.status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(
    new ApiResponse(
        200, "user logout successfully " , {}
    )
  )


});

export { registerUser, loginUser , logOutUser };

import { Router } from "express";
import { upload } from "../middelweres/multer.middelwere.js";
import { loginUser, logOutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middelweres/auth.middelwere.js";
const router = Router();

router.route("/register").post(upload.single('avatar'),registerUser);
router.route("/login").post(loginUser);
//secure

router.route("/logout").post(verifyJWT,logOutUser)

export default router;
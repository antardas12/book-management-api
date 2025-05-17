import { Router } from "express";
import { verifyJWT } from "../middelweres/auth.middelwere.js";
import { upload } from "../middelweres/multer.middelwere.js";
import { addBook, delateBook, getAllBook, getOneBook, updateBook } from "../controllers/book.controller.js";

const router =Router();

router.route("/books").post(verifyJWT,upload.single('coverImage'),addBook);
router.route("/books").get(verifyJWT,getAllBook);
router.route("/books/:id").get(verifyJWT,getOneBook);
router.route("/books/:id").put(verifyJWT,upload.single('coverImage'),updateBook);
router.route("/books/:id").delete(verifyJWT,delateBook)

export default router;
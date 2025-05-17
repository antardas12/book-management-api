import { Book } from "../model/book.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandle } from "../utils/asynHandel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addBook = asyncHandle(async (req, res) => {
  const { title, author, publishedYear, language, status, category } = req.body;

  if (
    [title, author, language, status, category, publishedYear].some(
      (field) => typeof field !== "string" || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existBook = await Book.findOne({ title });
  if (existBook) {
    throw new ApiError(400, "this are is all ready register");
  }

  const localFilePath = req.file.path;
  if (!localFilePath) {
    throw new ApiError(400, "coverImage are required");
  }

  const coverImage = await uploadOnCloudinary(localFilePath);

  if (!coverImage) {
    throw new ApiError(500, "some error while upload file in cloudinary");
  }

  const book = await Book.create({
    userId: req.user._id,
    title,
    author,
    language,
    status,
    category,
    coverImage: coverImage.url,
  });

  const createdBook = await Book.findById(book._id);
  if (!createdBook) {
    throw new ApiError(500, "some internal error while create the book");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "book add successfully", createdBook));
});

// get all book

const getAllBook = asyncHandle(async (req, res) => {
  const books = await Book.find();
  if (books.length === 0) {
    throw new ApiError(404, "no book found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "all book fetch successfully", books));
});

const getOneBook = asyncHandle(async (req, res) => {
  const { id } = req.params;
  console.log("Requested Book ID:", id);

  const book = await Book.findById(id);
  if (!book) {
    throw new ApiError(404, "Book not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Book fetched successfully", book));
});

const updateBook = asyncHandle(async (req, res) => {
  const { title, author, publishedYear, language, status, category } = req.body;

  const { id } = req.params;
  const userId = req.user._id;

  if (
    [title, author, language, status, category, publishedYear].some(
      (field) => typeof field !== "string" || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const localFilePath = req.file.path;
  if (!localFilePath) {
    throw new ApiError(400, "coverImage are required");
  }

  const coverImage = await uploadOnCloudinary(localFilePath);

  if (!coverImage) {
    throw new ApiError(500, "some error while upload file in cloudinary");
  }

  const book = await Book.findById(id);
  if (!book) {
    throw new ApiError(404, "book are not found ");
  }

  if (String(book.userId) !== String(userId)) {
    throw new ApiError(401, "You are not authorized to update this book");
  }

  (book.title = title),
    (book.author = author),
    (book.publishedYear = publishedYear),
    (book.category = category),
    (book.language = language),
    (book.status = status),
    (book.coverImage = coverImage.url),
    await book.save();

  const updatedBook = await Book.findById(book._id);

  if (!updateBook) {
    throw new ApiError(500, "book are not updated");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "book update successful", updatedBook));
});

const delateBook = asyncHandle(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const book = await Book.findById(id);
  if (!book) {
    throw new ApiError(404, "book not found");
  }

  if (String(book.userId) !== String(userId)) {
    throw new ApiError(401, "You are not authorized to delete this book");
  }

  await book.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "Book deleted successfully", null));
});

export { addBook, getAllBook, getOneBook, updateBook, delateBook };

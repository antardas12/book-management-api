import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {

  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  publishedYear: {
    type: String,
    require : true

  },
  coverImage: {
    type: String,
    trim: true,
  },
  language: {
    type: String,
    enum: ['English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese'],
    default: 'English',
    trim: true,
  },
  status: {
    type: String,
    enum: ['Available', 'Checked Out', 'Reserved', 'Lost'],
    default: 'Available',
  },
  category: {
    type: String,
    enum: ['Fiction', 'Non-Fiction', 'Science', 'Biography', 'Technology', 'History', 'Children'],
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // optional depending on use case
  }

    },{
timestamps : true
    }
);

export const Book = mongoose.model("Book",bookSchema)
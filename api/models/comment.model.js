import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      requied: true,
    },
    postId: {
      type: String,
      requied: true,
    },
    content: {
      type: String,
      requied: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    numberofLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;

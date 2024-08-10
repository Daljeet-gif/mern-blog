import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, userId, postId } = req.body;

    if (userId !== req.user.id) {
      return next(
        errorHandler(404, "You are not allowed to comment on this post")
      );
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comments = await Comment.findById(req.params.commentId);

    if (!comments) {
      return next(errorHandler(403, "Comment not found"));
    }
    const userIndex = comments.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comments.numberofLikes += 1;
      comments.likes.push(req.user.id);
    } else {
      comments.numberofLikes -= 1;
      comments.likes.splice(userIndex, 1);
    }
    await comments.save();
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const EditComment = async (req, res, next) => {
  try {
    const comments = await Comment.findById(req.params.commentId);

    if (!comments) {
      return next(errorHandler(403, "Comment not found"));
    }
    if (comments.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "Ypu are not allowed to edit this comment")
      );
    }
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

export const DeleteComment = async (req, res, next) => {
  try {
    const comments = await Comment.findById(req.params.commentId);

    if (!comments) {
      return next(errorHandler(403, "Comment not found"));
    }
    if (comments.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to delete this comment")
      );
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("comment has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to get all comments"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 0;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMothComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({comments,totalComments,lastMothComments})
  } catch (error) {
    next(error);
  }
};

import express from "express";
import { verifyToken } from "../utils/vetifyUser.js";


import { createComment, DeleteComment, EditComment, getComments, getPostComments, likeComment } from "../controllers/comment.controller.js";

const router = express.Router();



router.get('/getPostComments/:postId',verifyToken,getPostComments)
router.post("/create", verifyToken, createComment);
router.put("/likeComment/:commentId", verifyToken,likeComment);
router.put("/editComment/:commentId", verifyToken,EditComment);
router.delete("/delete/:commentId", verifyToken,DeleteComment);
router.get('/getcomments', verifyToken, getComments);
export default router;

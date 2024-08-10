import express from "express";
import { verifyToken } from "../utils/vetifyUser.js";

import { createPost, deletePost, getPost, updatepost } from "../controllers/post.controller.js";

const router = express.Router();


router.get('/getposts',getPost)
router.delete('/deletepost/:postId/:userId',verifyToken,deletePost)
router.put('/updatepost/:postId/:userId',verifyToken,updatepost)
router.post("/create", verifyToken, createPost);

export default router;

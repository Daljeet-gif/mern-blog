import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import authRouter from "./routers/auth.router.js";
import userRouter from "./routers/user.route.js";
import postRouter from "./routers/post.router.js";
import commentRouter from "./routers/comment.Router.js";
import cookieParser from "cookie-parser";
import path from "path";
dotenv.config();

const port = 3000;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB is Connected");
  })
  .catch((err) => {
    console.log(err);
  });
  const __dirname = path.resolve();

const app = express();
app.use(cookieParser());
app.use(express.json());

app.listen(port, () => {
  console.log("server is running on port ", port);
});

app.use("/api/user", userRouter),
  app.use("/api/auth", authRouter),
  app.use("/api/post", postRouter),
  app.use("/api/comment", commentRouter),
  app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

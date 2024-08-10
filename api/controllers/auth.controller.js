import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "fill all the feilds"));
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    next(errorHandler(400, "User already exist"));
  }

  const hasspassword = await bcryptjs.hash(password, 10);

  const newUser = new User({ username, email, password: hasspassword });

  try {
    await newUser.save();
    res.status(201).json("Welcome " + newUser.username);
  } catch (error) {
    next(error);
  }
};
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "fill all the feilds"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
     return next(errorHandler(404, "User does not exsited"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }

    const token = jwt.sign({ id: validUser._id ,isAdmin:validUser.isAdmin }, process.env.JWT_SECRET);

    const { password:pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};



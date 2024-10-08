import User from "../models/user";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import bcrypt from "bcryptjs";

// Joi schemas for validation
const signupSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Mật khẩu không khớp",
  }),
});
const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }
    // Kiểm tra xem có người dùng nào trong hệ thống chưa
    const userCount = await User.countDocuments({});
    // Nếu không có người dùng nào, đặt vai trò là admin, ngược lại là customer
    const role = userCount === 0 ? "admin" : "customer";
    // Tạo người dùng mới
    const user = await User.create({ username, email, password, role });
    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};
export const signin = async (req, res) => {
  try {
    // Validate request body
    const { error } = signinSchema.validate(req.body);
    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.details[0].message });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Email không tồn tại" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Mật khẩu không đúng" });
    }

    // Tạo token và trả về cho người dùng
    const token = jwt.sign({ _id: user._id }, import.meta.env.VITE_JWT_SECRET, {
      expiresIn: "1h",
    });
    // // Sanitize user object
    const sanitizedUser = {
      username: user.username,
      email: user.email,
      role: user.role,
    };

    res.status(StatusCodes.OK).json({ token, user: sanitizedUser });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

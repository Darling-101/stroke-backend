const express = require("express");
const Router = express.Router();
const UserSchema = require("../model/user");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

//Dang ki POST

Router.post("/register", async (req, res) => {
  const user = req.body;

  if (!user.phone || !user.password) {
    return res
      .status(400)
      .json({ success: false, message: "Chưa nhập thông tin" });
  }

  try {
    const existUser = await UserSchema.findOne({ phone: user.phone });
    if (existUser) {
      return res
        .status(400)
        .json({ success: false, message: "Số điện thoại đã được đăng kí" });
    }

    const hashPassword = await argon2.hash(user.password);
    const newUser = new UserSchema({ ...user, password: hashPassword });
    await newUser.save();

    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.status(200).json({
      success: true,
      message: "Tạo tài khoản thành công",
      data: null,
      accessToken: accessToken,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ success: false, message: "Đăng kí không thành công" });
  }
});

Router.post("/login", async (req, res) => {
  const user = req.body;
  if (!user.phone || !user.password) {
    return res
      .status(400)
      .json({ success: false, message: "Chưa nhập thông tin" });
  }
  try {
    const existUser = await UserSchema.findOne({ phone: user.phone });
    if (!existUser) {
      return res
        .status(400)
        .json({ success: false, message: "Tài khoản chưa tồn tại" });
    }

    const isValidPassword = await argon2.verify(
      existUser.password,
      user.password
    );
    if (isValidPassword) {
      const accessToken = jwt.sign(
        { userId: existUser._id },
        process.env.ACCESS_TOKEN_SECRET
      );
      return res
        .status(200)
        .json({ success: true, message: "Đăng nhập thành công", data: {accessToken} });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Đăng nhập không thành công" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ success: false, message: "Đăng nhập không thành công" });
  }
});

module.exports = Router;

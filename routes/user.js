const express = require("express");
const Router = express.Router();
const UserSchema = require("../model/user");
const verifyToken = require("../middleware/auth");

Router.get("/get-relationships", verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const user = await UserSchema.findById(userId);
    const nguoi_than_id = user.RelationshipId;
    if (!nguoi_than_id) {
      return res
        .status(400)
        .json({ success: false, message: "Không có người thân nào" });
    }

    let nguoi_than = await UserSchema.find({ _id: { $in: nguoi_than_id } });
    return res.status(200).json({
      success: true,
      nguoi_than: nguoi_than,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "Cập nhật thất bại" });
  }
});

Router.post("/update", verifyToken, async (req, res) => {
  const data = req.body;
  const userId = req.userId;

  try {
    const updated = await UserSchema.findByIdAndUpdate(userId, data);
    res
      .status(200)
      .json({ success: true, message: "Cập nhật thành công", data: updated });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Cập nhật không thành công" });
  }
});

Router.post("/set-role", verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    await UserSchema.findByIdAndUpdate(userId, { role: "doctor" });
    res.status(200).json({ success: true, message: "Cập nhật thành công" });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Cập nhật không thành công" });
  }
});

Router.get("/health-info", verifyToken, async (req, res) => {
  const userId = req.userId;
  try {
    const user = await UserSchema.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy người này" });
    }
    const { height, weight, heartSpeed, ...data } = user;
    const _res = { height, weight, heartSpeed };
    res.status(200).json({ success: true, data: _res });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "Không tìm thấy người này" });
  }
});

//Lay danh sach bac si theo benh vien
Router.post("/doctors", async (req, res) => {
  const hospitalName = req.body?.hospitalName;
  try {
    let doctors = await UserSchema.find({
      role: "doctor",
      workPlace: hospitalName,
    });
    if (doctors.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "Chưa có ai làm bác sĩ cả!!" });
    }

    doctors = doctors.map((doctor) => {
      const { password, ...data } = doctor._doc;
      return data;
    });

    return res.status(200).json({ success: false, data: doctors });
  } catch (err) {
    console.log(err);
    return res
      .status(200)
      .json({ success: false, message: "Chưa có ai làm bác sĩ cả!!" });
  }
});

//Them onesignal playerid
Router.post("/onesignal", verifyToken, async (req, res) => {
  const userId = req.userId;
  try {
    await UserSchema.findByIdAndUpdate(userId, {
      onesignalId: req.body.onesignalId,
    });
    res.status(200).json({success: true, message: 'them thanh cong'})
  } catch (err) {
    console.log(err);
  }
});

module.exports = Router;

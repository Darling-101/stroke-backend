const express = require("express");
const Router = express.Router();
const UserSchema = require("../model/user");
const verifyToken = require("../middleware/auth");

Router.post("/add-phone", verifyToken, async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const userId = req.userId;

  try {
    const nguoi_than = await UserSchema.find({ phone: phoneNumber });
    
    if (nguoi_than.length === 0) {
      return res
        .status(400)
        .send({ success: false, message: "Không tìm thấy người này" });
    }

    const nguoi_them = await UserSchema.findById(userId);
    
    if(nguoi_them.RelationshipId.includes(nguoi_than[0]._id)){
      console.log("hh=ehe");
      return res.status(400).json({success: false, message: "Đã có người này trong danh sách"})
    }

    await UserSchema.findByIdAndUpdate(userId, {
      $push:{RelationshipId: nguoi_than[0]._id},
    });
    
    return res
      .status(200)
      .json({ success: true, message: "Thêm người thân thành công" });
  } catch (err) {
    console.log(err);
  }
});

Router.post("/change-sos-status",verifyToken, async (req, res) =>{
  const userId = req.userId;

  try{
    const nguoi_benh = await UserSchema.findById(userId);
    if(!nguoi_benh){
      return res.status(400).json({success: false, message: "Không tồn tại người nài"})
    }

    await UserSchema.findByIdAndUpdate(userId, {SOS: true})
    res.status(200).json({success: true, message: "Đổi trạng thái thành công"})
  }catch(err){
    return res.status(400).json({success: false, message: "Cập nhật thất bại"})
  }
})

module.exports = Router;
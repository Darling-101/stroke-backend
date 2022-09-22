const express = require("express");
const Router = express.Router();
const MessageSchema = require("../model/Message");

//create new
Router.post("/", async (req, res) => {
  const newMessage = new MessageSchema(req.body);
  try {
    const saved = await newMessage.save();

    res.status(200).json({ success: true, message: saved });
  } catch (err) {
    return res.status(500).json({ success: false, Error: err });
  }
});

//get message
Router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await MessageSchema.find({
      conversationId: req.params.conversationId,
    });

    if (!messages) {
      return res
        .status(400)
        .json({ success: false, message: "Không tim thấy cuộc hội thoại này" });
    }

    return res.status(200).json({ success: false, data: messages });
  } catch (err) {
    return res.status(500).json({ success: false, Error: err });
  }
});

module.exports = Router;

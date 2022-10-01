const express = require("express");
const Router = express.Router();
const ConversationSchema = require("../model/Conversation");
const verifyToken = require("../middleware/auth");

//create conversation
Router.post('/', async (req, res)=>{
  const newConversation = new ConversationSchema({
    members: [req.body.senderId, req.body.receiverId]
  })

  try{
    const saved = await newConversation.save();
    return res.status(200).json({success: true, conversationId: saved._id})
  }catch(err){
    console.log(err);
     return res.status(500).json({success: false, Error: err})
  }
  
})

//get conversation
Router.get('/',verifyToken, async (req, res)=>{
  const userId = req.userId;

  try{
    const conversation = await ConversationSchema.find({
      members: {$in:[userId]}
    })
   
    return res.status(200).json({success: true, data: conversation})
  }catch(err){
    console.log(err);
    return res.status(500).json({success: false, Error: err})
  }
  
})


module.exports = Router;

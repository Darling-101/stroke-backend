const express = require("express");
const Router = express.Router();
const ConversationSchema = require("../model/Conversation");
const verifyToken = require("../middleware/auth");
const UserSchema = require("../model/user");


//create conversation
Router.post('/', async (req, res)=>{
  const newConversation = new ConversationSchema({
    members: [req.body.senderId, req.body.receiverId]
  })

  try{
    const existed = await ConversationSchema.find({members: [req.body.senderId, req.body.receiverId]})
    if(existed){
      return res.status(200).json({success: true, conversationId: existed[0]._id})
    }


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

    const members = conversation.map((e)=> e.members);

    receiverId = members.map(e=>{
      for(let i = 0 ; i < 2; i++){
        if(e[i] !== userId){
          return e[i];
        }
      }
    })

    const sender = await UserSchema.find({
      _id:{$in:receiverId}
    })
   
    return res.status(200).json({success: true, data: conversation, sender})
  }catch(err){
    console.log(err);
    return res.status(500).json({success: false, Error: err})
  }
  
})


module.exports = Router;

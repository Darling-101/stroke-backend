const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fullname:{type:String,},
  phone: {type:String, require: true},
  sex: {type: String},
  password: {type: String, require: true},
  position: {type: Array, default: []},
  RelationshipId: {type:Array, default: []},
  SOS: {type: Boolean, default: false},
  role: {type: String, default: 'user'}
})

module.exports = mongoose.model("User", UserSchema);
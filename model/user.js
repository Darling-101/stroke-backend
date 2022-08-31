const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  phone: {type:String, require: true},
  password: {type: String, require: true},
  position: {type: Array, default: []},
  RelationshipPhone: {type:Array, default: []}
})

module.exports = mongoose.model("User", UserSchema);
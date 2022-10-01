const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fullname: { type: String },
  phone: { type: String, require: true },
  sex: { type: String },
  birthOfDate: {type: String},
  password: { type: String, require: true },
  position: { type: Array, default: [] },
  RelationshipId: { type: Array, default: [] },
  SOS: { type: Boolean, default: false },
  role: { type: String, default: "user" },
  weight: { type: Number, default:0 },
  height: { type: Number, default: 0 },
  heartSpeed: { type: Number, default:0 },
  tamThu: {type:Number, default:0 },
  tamTuong: {type: Number, default:0 },
  workPlace: {type:String, default: ''}
},{timestamps:true});

module.exports = mongoose.model("User", UserSchema);

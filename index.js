const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require('./routes/auth');
const sosRoute = require('./routes/sos')
const userRoute = require('./routes/user')
const conversationRoute = require('./routes/conversation')
const messageRoute = require('./routes/message')
const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("ket noi db thanh cong");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/v1/user", userRoute);
app.use("/api/v1/sos", sosRoute);
app.use("/api/v1/conversation", conversationRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/auth", authRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("sever is running at port ",process.env.PORT || 5000 );
});

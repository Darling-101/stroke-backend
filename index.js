const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const sosRoute = require("./routes/sos");
const userRoute = require("./routes/user");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("ket noi db thanh cong");
  })
  .catch((err) => {
    console.log(err);
  });

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/sos", sosRoute);
app.use("/api/v1/conversation", conversationRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/auth", authRoute);

server.listen(process.env.PORT || 5000, () => {
  console.log("sever is running at port ", process.env.PORT || 5000);
});

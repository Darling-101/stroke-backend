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
// const server = require("http").createServer(app);
// const io = require("socket.io")(server);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("ket noi db thanh cong");
  })
  .catch((err) => {
    console.log(err);
  });

// let users = [
//   {
//     userId: "63142c4f038298556063cf0f",
//     socketId: "1UYxOkVNT6PHUoeXAAAB",
//   },
// ];

// const addUser = (userId, socketId) => {
//   console.log(users);
//   const newUser = { userId: userId, socketId: socketId };
//   const isExist = users.some((user) => user.userId === userId);

//   //if user not exist
//   if (isExist === false) {
//     users.push(newUser);
//     return;
//   }

//   //if user exist
//   for (let i = 0; i < users.length; i++) {
//     if (users[i] === newUser) {
//       users[i] = newUser;
//     }
//   }
// };

// const getUser = (userId) => {
//   const user = users.filter((e) => e.userId === userId);
//   return user[0];
// };

// io.on("connection", (socket) => {
//   console.log("a user connected.");

//   //take userId and socketId from user
//   socket.on("addUser", (userId) => {
//     addUser(userId, socket.id);
//     //console.log("user after add:", users);
//     //io.emit("getUsers", users);
//   });

//   //send and get message
//   // socket.on("sendMessage", ({ senderId, receiverId, text }) => {
//   //   const user = getUser(receiverId);
//   //   io.emit("getMessage", {
//   //     senderId,
//   //     text,
//   //   });
//   // });

//   socket.on("sendMessage", ({ senderId, receiverId, text }) => {
//     const user = getUser(receiverId);
//     io.to(user.socketId).emit("sendMessage", {
//       senderId,
//       text,
//     });
//   });

//   //when disconnect
//   socket.on("disconnect", () => {
//     console.log("a user disconnected!");
//     //removeUser(socket.id);
//     //io.emit("getUsers", users);
//   });
// });

app.use("/api/v1/user", userRoute);
app.use("/api/v1/sos", sosRoute);
app.use("/api/v1/conversation", conversationRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/auth", authRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("sever is running at port ", process.env.PORT || 5000);
});

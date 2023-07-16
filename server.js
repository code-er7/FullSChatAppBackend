import express from "express";
// import { chats } from './data/data.js';
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRouter from "./Routes/userRoute.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import chatRoutes from "./Routes/chatRoutes.js";
import messageRoutes from "./Routes/messageRoutes.js";
import { Socket } from "socket.io";
import cors from "cors";

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("API is working");
});
app.use("/api/user", userRouter);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(`${PORT}`, () => {
  console.log(`Server is listining on port : ${PORT}`);
});

import { Server } from "socket.io";
import { removeFromGroup } from "./controllers/chatControllers.js";
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection" , (socket)=>{
    console.log('connected to socket.io');
    socket.on('setup' , (userData)=>{
        socket.join(userData._id);
        socket.emit("connected");
    });
    socket.on('join chat', (room)=>{
        socket.join(room);
        console.log('user Joined Room: '+room);
    });
    socket.on('typing' , (room)=>socket.in(room).emit("typing"));
    socket.on('stop typing' , (room)=>socket.in(room).emit("stop typing"));
    socket.on('new message', (newMessageRecieved)=>{
        var chat = newMessageRecieved.chat;
        // console.log('new message recived');
        if(!chat.users)return console.log('chat.users not defined');

        chat.users.forEach((user) => {
            if(user._id == newMessageRecieved.sender._id)return ;
            socket.in(user._id).emit("message recieved" , newMessageRecieved);
        });

    });
    socket.off("setup" , ()=>{
        console.log("User Disconnected");
        socket.leave(userData._id);
    })
});
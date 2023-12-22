require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const socket = require("socket.io");
const app = express();

// Routes
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log("DB Connetion Successfull");
    }).catch((err) => {
        console.log(err.message);
    }
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>
    console.log(`Server started on ${process.env.PORT}`)
);

// Socket Configuration
const io = socket(server, { 
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    }
});


global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);
        }
    });
});

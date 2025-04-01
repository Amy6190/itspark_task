require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const socketManager = require("./config/socketManager");
const authenticateSocket = require("./middleware/authSocket")




const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // its a frontend url 
  credentials: true
}));

socketManager.init(server, {
  cors: {
    origin: "http://localhost:3000", // its a frontend url 
    methods: ["GET", "POST"],
    credentials: true
  }
});
const apiRouter = express.Router();
apiRouter.use("/users", userRoutes);
apiRouter.use("/notifications", notificationRoutes);
app.use("/api", apiRouter);

const io = socketManager.getIO();

io.use(authenticateSocket).on("connection", (socket) => {
  console.log("User connected:", socket.userId);
  
  socket.join(`user_${socket.userId}`);
  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
let io;

module.exports = {
  init: (httpServer, options = {}) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      ...options
    });
    return io;
  },
  getIO: () => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
  }
};
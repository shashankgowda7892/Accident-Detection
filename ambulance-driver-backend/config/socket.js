const socketIo = require("socket.io");

let io; // Socket.io instance

// Function to initialize socket.io and set up event listeners
const initSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*", // Allow connections from any origin (you can restrict this later if needed)
      methods: ["GET", "POST"],
    },
  });

  // Listen for new connections from clients
  io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    // Example: Listen for 'location-update' event
    socket.on("location-update", (data) => {
      console.log("Location update received:", data);
      // You can handle the data here (e.g., store in DB or broadcast to other users)
      
      // Optionally, broadcast the updated location to all connected clients
      io.emit("location-update", data);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

// Function to get the socket.io instance (to emit events later)
const getIoInstance = () => {
  return io;
};

module.exports = {
  initSocket,
  getIoInstance,
};

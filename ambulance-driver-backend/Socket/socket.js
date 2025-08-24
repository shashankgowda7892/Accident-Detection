const { Server } = require("socket.io");

let io; // Declare io globally
let ambulanceSocketMap = {}; // Store socket IDs by ambulance ID

// Initialize socket with server
const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      // "http://localhost:3000" ||
      origin: process.env.FRONTEND_URL ||  "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    // Register ambulance socket
    socket.on("registerAmbulance", (ambulanceId) => {
      ambulanceSocketMap[ambulanceId] = socket.id;
      console.log("Ambulance Socket Map:", ambulanceSocketMap);
      console.log(`Ambulance registered: ${ambulanceId} -> ${socket.id}`);
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      // Remove the ambulance entry if the socket belongs to one
      for (const ambulanceId in ambulanceSocketMap) {
        if (ambulanceSocketMap[ambulanceId] === socket.id) {
          delete ambulanceSocketMap[ambulanceId];
          console.log(`Ambulance unregistered: ${ambulanceId}`);
          break;
        }
      }
    });
  });
  
  console.log("Socket.io initialized.");
};


// Simulate accident detection and emit an alert
const emitAccidentAlert = (ambulanceSocketId,accidentData) => {
  console.log("Simulating accident detection... Sending accident alert.");

  // Here we're emitting to all connected clients (dashboard) - adjust as needed
  io.to(ambulanceSocketId).emit("accident-alert", accidentData);

  console.log("Accident alert emitted to dashboard with data:", accidentData);
};



  


// Export io and ambulanceSocketMap for access outside this file
module.exports = { initializeSocket, ambulanceSocketMap,  emitAccidentAlert };

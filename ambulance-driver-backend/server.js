const express = require("express");
const cors = require("cors");
const http = require("http");
const { Pool } = require("pg");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const authenticateToken = require("./middlewares/authMiddleware");
const adminRoutes = require("./routes/admin"); // Renamed to adminRoutes for clarity
const { initializeSocket } = require("./Socket/socket"); // Import socket initialization

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;



// Create HTTP server
const server = http.createServer(app); // Use this for both HTTP and Socket.io

// Configure CORS options
const corsOptions = {
  // "http://localhost:3000" ||
  origin: process.env.FRONTEND_URL || "http://localhost:3000" , // Use environment variable for flexibility
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json()); // Built-in express JSON parser
app.use("/accident_video", express.static("./accident_video")); // Static files for images

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes); // Renamed to adminRoutes for consistency

// Protected Route Example
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// Connect to PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Error connecting to PostgreSQL:", err));

// Initialize socket server
initializeSocket(server);




// Start the HTTP server
server.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

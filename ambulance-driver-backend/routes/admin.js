const express = require("express");
const multer = require("multer");
const {getCameras,uploadVideo} = require("../controllers/adminController");

const router = express.Router();

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Get all cameras
router.get("/cameras", getCameras);

// Upload video
router.post("/upload-video", upload.single("video"), uploadVideo);

module.exports = router;

const express = require("express");
const { updateLocation,updateStatus,logout} = require("../controllers/userController");

const router = express.Router();

// Update location route
router.post("/update-location", updateLocation);
router.post("/update-status", updateStatus);
router.post("/logout", logout);
module.exports = router;

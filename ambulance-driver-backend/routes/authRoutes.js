const express = require("express");
const { login,logout } = require("../controllers/authController");
const router = express.Router();

// Login route
router.post("/login", login);
// router.get("/logout",logout)
module.exports = router;

const { loginUser } = require("../services/authService");

const login = async (req, res) => {
  const { driverId, password } = req.body;

  try {
    if (!driverId || !password) {
      return res.status(400).json({ message: "Driver ID and password are required." });
    }
    
    
    // Call the service to handle business logic
    const token = await loginUser(driverId, password);

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




module.exports = { login };

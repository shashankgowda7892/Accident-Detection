const { updateAmbulanceLocation,updateAmbulanceStatus,logoutUser } = require("../services/userService");

const updateLocation = async (req, res) => {
  const { driverId, latitude, longitude } = req.body;

  try {
    // Validate input
    if (!driverId || !latitude || !longitude) {
      return res.status(400).json({ message: "Driver ID, latitude, and longitude are required." });
    }

    // Call the service
    await updateAmbulanceLocation(driverId, latitude, longitude);

    res.status(200).json({ message: "Location updated successfully." });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ message: "Server error. Unable to update location." });
  }
};



const updateStatus = async (req, res) => {
  const { driverId, status } = req.body;

  try {
    
    await updateAmbulanceStatus(driverId, status);

    res.status(200).json({ message: "Status updated successfully." });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server error. Unable to update status." });
  }
};

const logout = async (req, res) => {
  const { driverId } = req.body;

  await logoutUser(driverId);
  res.status(200).json({ message: "Logoutted successfully!" });
}



module.exports = { updateLocation,updateStatus,logout };

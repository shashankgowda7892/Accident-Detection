const { query } = require("../config/db");

const updateAmbulanceLocation = async (driverId, latitude, longitude) => {
  // Check if the ambulance exists
  console.log("driverId", driverId);
  console.log("latitude", latitude);
  console.log("longitude", longitude);
  
  
  const result = await query("SELECT * FROM ambulances WHERE driver_id = $1", [driverId]);

  if (result.rows.length === 0) {
    throw new Error("Ambulance not found for the given driver ID.");
  }

  // Update the location in the database
  await query(
    "UPDATE ambulances SET latitude = $1, longitude = $2, last_updated = NOW() WHERE driver_id = $3",
    [latitude, longitude, driverId]
  );
};



const updateAmbulanceStatus = async (driverId, status) => {
  // Check if the ambulance exists
  const result = await query("SELECT * FROM drivers WHERE driver_id = $1", [driverId]);

  if (result.rows.length === 0) {
    throw new Error("Driver not found for the given driver ID.");
  }

  // Update the status in the database
  await query("UPDATE drivers SET status = $1 WHERE driver_id = $2", [status, driverId]);
};

const logoutUser = async (driverId) => {
  // Check if the ambulance exists
  const result = await query("SELECT * FROM drivers WHERE driver_id = $1", [driverId]);

  if (result.rows.length === 0) {
    throw new Error("Driver not found for the given driver ID.");
  }

  // Update the status in the database
  await query("UPDATE drivers SET status = 'offline' WHERE driver_id = $1", [driverId]);
};



module.exports = { updateAmbulanceLocation,updateAmbulanceStatus,logoutUser };

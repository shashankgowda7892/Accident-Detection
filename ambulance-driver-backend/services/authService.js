const jwt = require("jsonwebtoken");
const { query } = require("../config/db");

const loginUser = async (driverId, password) => {
  // Fetch the driver from the database
  const result = await query("SELECT * FROM drivers WHERE driver_id = $1", [driverId]);

  if (result.rows.length === 0) {
    throw new Error("Invalid driver ID.");
  }

  const user = result.rows[0];

  // Compare the password (assuming it's stored as plaintext — not recommended in production)
  if (user.password !== password) {
    throw new Error("Incorrect password.");
  }

  const insertQuery = `
  INSERT INTO ambulances (driver_id, latitude, longitude, last_updated)
  VALUES ($1, 0.0, 0.0, NOW())  -- You can initialize latitude and longitude to 0.0 or use actual coordinates
  ON CONFLICT (driver_id) DO UPDATE
  SET latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude, last_updated = NOW();  -- Update existing record if driver_id already exists
`;

const insertValues = [driverId];


  try {
    // Execute the insert query to add the ambulance data
    await query(insertQuery, insertValues);
    await query("UPDATE drivers SET status = 'online' WHERE driver_id = $1", [driverId]);
  } catch (err) {
    console.error("Error inserting ambulance record:", err);
    throw new Error("Failed to insert ambulance data.");
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, driverId: user.driver_id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token;
};






module.exports = { loginUser };

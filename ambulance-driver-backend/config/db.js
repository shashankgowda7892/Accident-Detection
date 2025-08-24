// db.js
const { Pool } = require('pg');
require('dotenv').config();

// Create a pool of connections for PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Function to execute queries
const query = async (text, params) => {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
};

// Function to create tables
const createTables = async () => {
  const ambulanceTable = `
    CREATE TABLE IF NOT EXISTS ambulances (
      id SERIAL PRIMARY KEY,
      driver_id VARCHAR(255) UNIQUE NOT NULL,
      latitude DOUBLE PRECISION NOT NULL,
      longitude DOUBLE PRECISION NOT NULL,
      last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const cameraTable = `
    CREATE TABLE IF NOT EXISTS cameras (
      id SERIAL PRIMARY KEY,
      camera_id VARCHAR(255) UNIQUE NOT NULL,
      latitude DOUBLE PRECISION NOT NULL,
      longitude DOUBLE PRECISION NOT NULL
    );
  `;

  const driverTable = `
    CREATE TABLE IF NOT EXISTS drivers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      driver_id VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      phone_number VARCHAR(15) UNIQUE NOT NULL,
      status VARCHAR(255) DEFAULT 'offline'
    );
  `;

  try {
    await query(ambulanceTable);
    console.log("Ambulance table created or already exists.");

    await query(cameraTable);
    console.log("Camera table created or already exists.");

    await query(driverTable);
    console.log("Driver table created or already exists.");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};
createTables();
// Export pool and the createTables function
module.exports = {
  pool,
  query,
  createTables
};

const { query } = require("../config/db"); // Import your database connection
const axios = require('axios');

// Get camera by ID
exports.getCameraById = async (cameraId) => {
  const result = await query("SELECT * FROM cameras where id = $1", [cameraId]);
  return result.rows;
};

// Get all ambulances
exports.getAmbulances = async () => {
  const result = await query("SELECT a.* FROM ambulances a JOIN drivers d ON a.driver_id = d.driver_id WHERE d.status = 'online'");
  return result.rows;
};


// Function to call OpenRouteService Distance Matrix API
exports.getOpenRouteServiceDistanceMatrix = async (locations) => {
  const url = "https://api.openrouteservice.org/v2/matrix/driving-car";
  const headers = {
    "Authorization": "5b3ce3597851110001cf6248648d0355bd604e15b7f666af7d9e147a", // Your API key in environment variable
    "Content-Type": "application/json"
  };

  const payload = {
    "locations": locations, // Locations include the origin (camera) and destinations (ambulances)
    "metrics": ["distance", "duration"]
  };

  try {
    const response = await axios.post(url, payload, { headers });
    return response.data;
  } catch (error) {
    console.error('Error calling OpenRouteService API:', error);
    throw error;
  }
};

// Function to find the nearest ambulance to the camera location
exports.getNearbyAmbulances = async (cameraLocation, ambulanceLocations) => {
  // Ensure camera location has valid coordinates
  console.log(cameraLocation.longitude);
  
  if (!cameraLocation || !cameraLocation.longitude || !cameraLocation.latitude) {
    console.error('Invalid camera location:', cameraLocation);
    return null;
  }

  // OpenRouteService requires locations in [longitude, latitude] format
  const locations = [[cameraLocation.longitude, cameraLocation.latitude]]; // Camera location as origin

  // Add ambulance locations to the locations array
  ambulanceLocations.forEach(location => {
    if (location && location.longitude && location.latitude) {
      locations.push([location.longitude, location.latitude]); // Ambulance locations as destinations
    }
  });

  try {
    // Get the distance matrix from the camera location to all ambulance locations
    const distances = await exports.getOpenRouteServiceDistanceMatrix(locations);

    // Check if there is a valid distance matrix in the response
    if (!distances || !distances.distances) {
      console.error('Error: No distances in the response');
      return null;
    }

    // Find the nearest ambulance by checking the distances array
    let nearestAmbulance = null;
    let minDistance = Infinity;

    // The first row (distances[0]) contains the distances from the camera location (origin)
    distances.distances[0].slice(1).forEach((distance, index) => {
      // If the distance is the smallest, update the nearest ambulance
      if (distance < minDistance) {
        minDistance = distance;
        nearestAmbulance = ambulanceLocations[index]; // Get the ambulance corresponding to the minimum distance
      }
    });

    // Return the nearest ambulance
    return nearestAmbulance;

  } catch (error) {
    console.error('Error finding nearest ambulance:', error);
    return null;
  }
};
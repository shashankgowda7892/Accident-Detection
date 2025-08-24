const { getCameraById, getNearbyAmbulances, getAmbulances } = require("../services/databaseService");
const { processVideo } = require("../services/accidentDetection");
const { io, ambulanceSocketMap,emitAccidentAlert } = require("../Socket/socket"); // Correctly import the io object
const { query } = require("../config/db");

exports.getCameras = async (req, res) => {
  try {
    const result = await query("SELECT * FROM cameras"); // Fetch all cameras
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cameras." });
  }
};



exports.uploadVideo = async (req, res) => {
  const { cameraId } = req.body;

  if (!cameraId || !req.file) {
    return res.status(400).json({ message: "Camera ID and video file are required." });
  }

  try {
    // Process video for accident detection
    console.log(req.file.path);

    const result = await processVideo(req.file.path);
    console.log("Result video model:", result);
    
    if (result) {
      console.log("Accident detected!");

      // Get the camera's location
      const camera = await getCameraById(cameraId);
      console.log("Camera:", camera);

      if (!camera) {
        return res.status(404).json({ message: "Camera not found." });
      }

      const ambulanceLocations = await getAmbulances();
      console.log("Ambulance Locations:", ambulanceLocations);

      // Find nearby ambulances
      const nearestAmbulance = await getNearbyAmbulances(camera[0], ambulanceLocations);
      console.log('Nearest Ambulance:', nearestAmbulance);

      if (nearestAmbulance) {
        console.log("Nearest Ambulance Driver ID:", nearestAmbulance.driver_id);

        const ambulanceSocketId = ambulanceSocketMap[nearestAmbulance.driver_id];
        console.log('Ambulance Socket ID:', ambulanceSocketId);

        if (ambulanceSocketId) {
          // Prepare the accident data
          const accidentData = {
            cameraLocation: camera[0], // Camera location
            accidentVideo: `http://192.168.42.91:5000/${result.trim()}`, // Replace with actual image URL
            accidentDetails: {
              location: camera[0], // Location of accident
              time: new Date().toISOString(),
            },
          };
          console.log(accidentData);

          // Emit accident alert to the specific ambulance using the socket ID
          // io.to(ambulanceSocketId).emit("accident-alert", accidentData);
          emitAccidentAlert(ambulanceSocketId,accidentData);
          console.log(`Accident alert sent to ambulance ${nearestAmbulance.driver_id}`);
          res.status(200);
        } else {
          console.log("No ambulance socket ID found for the nearest ambulance.");
          res.status(404).json({ message: "No ambulance found to notify." });
        }
      } else {
        console.log("No nearby ambulance found.");
        res.status(404).json({ message: "No nearby ambulance found." });
      }
    } else {
      console.log("No accident detected.");
      res.status(200).json({ message: "No accident detected in the video." });
    }
  } catch (error) {
    console.error("Error processing video:", error);
    res.status(500).json({ message: "Error processing video." });
  }
};

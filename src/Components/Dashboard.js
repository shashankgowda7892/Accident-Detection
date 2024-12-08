import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // For navigation and location state
import socket from "../Utils/Socket"; // Socket instance import
import axios from "axios";

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { driverId } = location.state || {};
  const [alert, setAlert] = useState(null); // Store accident alert
  const [gpsAccess, setGpsAccess] = useState(true); // Track GPS access
  const [driverLocation, setDriverLocation] = useState(null); // Store driver's current location
  const [accidentImage, setAccidentImage] = useState(null); // Store accident image URL

  const apiUrl = process.env.REACT_APP_API_URL;
  // Logout function
  const handleLogout = () => {
    axios.post(`${apiUrl}/api/logout`, {
      driverId,
      
    });

    localStorage.removeItem("authToken"); // Clear session or local storage
    navigate("/"); // Navigate back to login page
    window.location.reload(); // Refresh the page to reset the state
  };

  // Function to fetch user's location and send it to the backend
  const updateLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const formattedLatitude = latitude.toFixed(6);
          const formattedLongitude = longitude.toFixed(6);

          setDriverLocation({ latitude: formattedLatitude, longitude: formattedLongitude });

          try {
            await axios.post(`${apiUrl}/api/update-location`, {
              driverId,
              latitude: formattedLatitude,
              longitude: formattedLongitude,
            });
            console.log("Location updated:", { latitude, longitude });
          } catch (error) {
            console.error("Failed to update location:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          if (error.code === error.PERMISSION_DENIED) {
            setGpsAccess(false);
          }
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setGpsAccess(false);
    }
  };

  // Function to register the driver with the server
  const registerDriver = () => {
    if (driverId) {
      socket.emit("registerAmbulance", driverId);
      console.log(`Driver registered with ID: ${driverId}`);
    }
  };

  // Request location and handle socket connection on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token || !driverId) {
      navigate("/"); // Redirect to login if not authenticated
      return;
    }

    registerDriver();
    updateLocation(); // Request location immediately

    socket.on("accident-alert", (data) => {
      console.log("Accident Alert Received:", data);
      setAlert(data);
      setAccidentImage(data.accidentImage || null);
    });

    const intervalId = setInterval(() => {
      updateLocation(); // Update location every 2 minutes
    }, 120000);

    return () => {
      clearInterval(intervalId);
      socket.off("accident-alert");
    };
  }, [driverId, navigate]);

  // Handle 'Accept' button click
  const handleAcceptAlert = () => {
    if (alert) {
      const { latitude, longitude } = alert.cameraLocation;
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
        "_blank"
      );
      // Update driver status to 'busy'
      axios.post(`${apiUrl}/api/update-status`, {
        driverId,
        status: "busy",
      });
    }
  };

  // Handle 'Done' button click
  const handleDone = () => {
    // Update driver status to 'online'
    axios.post(`${apiUrl}/api/update-status`, {
      driverId,
      status: "online",
    });
    // Clear states after completing the task
    setAlert(null);
    setAccidentImage(null);
    setDriverLocation(null);
  };

  // Fallback for accident image
  const handleImageError = () => {
    setAccidentImage(`${apiUrl}/images/accident.jpeg`);
  };

  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Display GPS access error */}
      {!gpsAccess && (
        <div className="bg-red-100 p-4 rounded-lg shadow-lg max-w-md mx-auto mb-4">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Location Access Required</h3>
          <p className="text-gray-700">
            Please enable location services in your browser to continue using the application.
          </p>
        </div>
      )}

      {/* Display accident alert */}
      {alert ? (
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl mx-auto mb-4">
          <h3 className="text-xl font-semibold text-red-600 mb-2">Accident Alert</h3>
          <p className="text-gray-700 mb-4">
            Accident at ({alert.cameraLocation.camera_id})
          </p>

          {accidentImage && (
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-700">Accident Image:</h4>
              <img
                src={accidentImage}
                alt="Accident"
                className="w-full h-auto rounded-lg shadow-md"
                onError={handleImageError}
              />
            </div>
          )}

          <div className="flex justify-between gap-4">
            <button
              onClick={handleAcceptAlert}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            >
              Accept and Navigate
            </button>
            <button
              onClick={handleDone}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No alerts at the moment.</p>
      )}
    </div>
  );
}

export default Dashboard;

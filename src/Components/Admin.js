import React, { useState, useEffect } from "react";
import axios from "axios";

const Admin = () => {
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState("");
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");

  const apiUrl = process.env.REACT_APP_API_URL;
  // Fetch the list of cameras when the component mounts
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/admin/cameras`);
        setCameras(response.data); // Store cameras in state
        console.log(response.data); // For debugging or additional data returned from the backend
        
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };
    fetchCameras();
  }, []);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file); // Update the video state with the selected file
  };

  const handleVideoUpload = async () => {
    if (!video || !selectedCamera) {
      setMessage("Please select both a camera and a video to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);
    formData.append("cameraId", selectedCamera); // Append the selected camera ID

    try {
      // Send the video and camera ID to the backend for processing
      const response = await axios.post(`${apiUrl}/api/admin/upload-video`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file upload
        },
      });

      setMessage("Video uploaded and processed successfully!");
      console.log(response.data); // For debugging or additional data returned from the backend

    } catch (error) {
      setMessage("Error uploading video.");
      console.error("Error uploading video:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 border-2 border-gray-300 rounded-md">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <div className="mb-4">
        <label htmlFor="camera-select" className="block text-sm font-medium text-gray-700">
          Select Camera
        </label>
        <select
          id="camera-select"
          onChange={(e) => setSelectedCamera(e.target.value)}
          className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-md"
        >
          <option value="">Select a Camera</option>
          {cameras.map((camera) => (
            
            <option key={camera.id} value={camera.id}>
              {camera.id} - {camera.camera_id}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="video-upload" className="block text-sm font-medium text-gray-700">Upload Video</label>
        <input
          type="file"
          id="video-upload"
          accept="video/*"
          onChange={handleVideoChange}
          className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-md"
        />
      </div>

      <button
        onClick={handleVideoUpload}
        className="px-4 py-2 mt-4 bg-blue-600 text-white rounded-md"
      >
        Upload Video
      </button>

      {message && (
        <div className="mt-4 p-2 text-center text-sm font-medium">
          {message}
        </div>
      )}
    </div>
  );
};

export default Admin;

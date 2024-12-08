import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [driverId, setDriverId] = useState("");
  const [password, setPassword] = useState(""); // State for the password
  const [errorMessage, setErrorMessage] = useState(""); // State to store error messages
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL;
  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/dashboard", { replace: true }); // Redirect to the dashboard if token exists
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (driverId && password) {
      try {
        // Send login credentials to the backend API
        const response = await axios.post(`${apiUrl}/api/auth/login`, {
          driverId,
          password,
        });

        // If login is successful, receive token and navigate to dashboard
        const { token } = response.data;

        // Store the token in localStorage for future requests
        localStorage.setItem("authToken", token);

        // Navigate to dashboard page with driverId
        navigate("/dashboard", { state: { driverId }, replace: true });
      } catch (error) {
        // Handle errors (incorrect credentials, server error, etc.)
        if (error.response) {
          setErrorMessage(error.response.data.message); // Show error message from server
        } else {
          setErrorMessage("Something went wrong, please try again later.");
        }
      }
    } else {
      setErrorMessage("Please enter your Driver ID and password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Login
        </h2>
        {/* Driver ID input */}
        <input
          type="text"
          placeholder="Enter Driver ID"
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* Password input */}
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* Error message display */}
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        {/* Login button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;

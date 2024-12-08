import { io } from 'socket.io-client';

const apiUrl = process.env.REACT_APP_API_URL;
// Replace with your backend URL or use 'localhost' if running locally
const socket = io(`${apiUrl}`); // URL should match your backend server

socket.on('connect', () => {
  console.log('Connected to the server with socket ID:', socket.id);
});

// Handle connection errors
socket.on('connect_error', (error) => {
  console.error('Connection failed with error:', error);
});



// Handle disconnection
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});



export default socket;  // Ensure you are exporting the socket correctly

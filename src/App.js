import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import Loader from "./Components/Loader"; // A simple loading spinner/component

// Lazy load components for better performance
const Login = lazy(() => import("./Components/Login"));
const Dashboard = lazy(() => import("./Components/Dashboard"));
const Admin = lazy(() => import("./Components/Admin"));

function App() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Route: Login Page */}
          <Route path="/" element={<Login />} />

          {/* Protected Route: Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Route: Admin Page */}
          <Route
            path="/admin"
            element={
             
                <Admin />
              
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

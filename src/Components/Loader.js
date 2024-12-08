import React from "react";

function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        {/* Spinner Animation */}
        <svg
          className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        {/* Loading Message */}
        <p className="text-lg text-gray-700">Loading, please wait...</p>
      </div>
    </div>
  );
}

export default Loader;

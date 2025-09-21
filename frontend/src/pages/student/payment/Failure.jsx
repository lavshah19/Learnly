import React from "react";
import { useNavigate } from "react-router-dom";

const Failure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <svg
          className="w-16 h-16 text-red-600 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>

        <h1 className="text-2xl font-bold text-red-700 mb-2">
          Payment Failed!
        </h1>
        <p className="text-gray-600 mb-6">
          There was an issue with your payment. Please try again.
        </p>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md 
                     hover:bg-red-700 transition duration-300"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default Failure;

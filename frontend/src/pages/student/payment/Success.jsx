import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { base64Decode } from "esewajs";
import axios from "axios";
import { verifyPaymentAndUpdateStatusService } from "@/services";

const Success = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("data");
  const decoded = base64Decode(token);

  const verifyPaymentAndUpdateStatus = async () => {
    try {
      const response = await verifyPaymentAndUpdateStatusService(decoded.transaction_uuid)
      if (response.status === 200) {
        setIsLoading(false);
        setIsSuccess(true);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error initiating payment:", error);
    }
  };

  useEffect(() => {
    verifyPaymentAndUpdateStatus();
  }, []);

  if (isLoading && !isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg font-medium">Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (!isLoading && !isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Oops!.. Error Occurred
          </h1>
          <h2 className="text-gray-700 mb-6">
            We couldn’t confirm your payment. Please try again later.
          </h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-md 
                       hover:bg-red-600 transition duration-300"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <svg
          className="w-16 h-16 text-green-600 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="text-2xl font-bold text-green-700 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your transaction was successful.
        </p>
        <button
          onClick={() => navigate("/student-courses")}
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md 
                     hover:bg-green-700 transition duration-300"
        >
          Go to My Courses
        </button>
      </div>
    </div>
  );
};

export default Success;

import React from "react";
import { Link, useRouteError } from "react-router-dom";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";

interface RouteError {
  statusText?: string;
  message?: string;
}

const ErrorPage: React.FC = () => {
  const error = useRouteError() as RouteError | null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-4">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md text-center">
        <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">Oops!</h1>
        <p className="text-xl mb-4">Something went wrong.</p>
        <p className="text-lg text-gray-600 mb-6">
          {error?.statusText || error?.message || "An unexpected error occurred."}
        </p>
        <Link to="/" className="btn btn-primary text-black">
          <FaHome className="mr-2" /> Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;

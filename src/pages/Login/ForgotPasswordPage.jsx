import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom"; // import useNavigate, useLocation, useParams

import Logo from "../../components/Login/Logo";
import RightPanel from "../../components/Login/RightPanel";
import ForgotPasswordForm from "../../components/Login/ForgotPassword"; // Assuming you have a form for Forgot Password

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(""); // For handling error messages
  const navigate = useNavigate();
  const location = useLocation();
  const { menuId: menuIdParam } = useParams(); // Getting menuId from URL params

  // menuId: Prioritize state, fallback to URL params
  const menuIdFromParam = menuIdParam ? Number(menuIdParam) : null;
  const menuId =
    location.state?.menuId !== undefined && location.state?.menuId !== null
      ? Number(location.state.menuId)
      : menuIdFromParam;

  // Mapping menuId to target pages
  const redirectMap = {
    1: "/dashboard",
    2: "/dashboard-laporan",
    // other menu options can be added here
  };

  // Set redirectTo based on state or default fallback
  const redirectTo =
    location.state?.redirectTo || redirectMap[menuId] || "/menu";

  // Handling the forgot password form submission
  const handleReset = (email) => {
    setError(""); // Reset error state
    setLoading(true); // Start loading

    // Simulate a reset process (e.g., validate the email)
    setTimeout(() => {
      setLoading(false); // End loading

      if (!email) {
        setError("Email is required."); // Set error if no email is provided
        return;
      }

      // Log email for the reset request (can be replaced with API call)
      console.log("Reset password for:", email);
      // TODO: Integrate actual reset password API here

      // After reset, navigate to the appropriate page
      setMessage("Jika email terdaftar, link reset password telah dikirim.");
      navigate(redirectTo, { replace: true });
    }, 1500); // Simulate API call delay
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 animate-fade-in">
      <Logo />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <ForgotPasswordForm
          onSubmit={handleReset} // Pass the handleReset function as prop
          loading={loading} // Show loading state on submit
          error={error} // Pass the error state here
        />
      </div>

      <RightPanel />
    </div>
  );
}

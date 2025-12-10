import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import Logo from "../../components/Login/Logo";
import RightPanel from "../../components/Login/RightPanel";
import RegisterForm from "../../components/Login/RegisterForm";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // Add message for success
  const navigate = useNavigate();
  const location = useLocation();
  const { menuId: menuIdParam } = useParams(); // Get menuId from URL params

  // Get menuId from location.state or use URL params
  const menuIdFromLocation = location.state?.menuId || menuIdParam;
  const menuId = menuIdFromLocation || 1;  // Default to 1 if missing

  // Handling the register form submission
  const handleRegister = (data) => {
    if (data.error) {
      setError(data.error);
      return;
    }

    setError("");
    setLoading(true);

    // Simulate registration process (e.g., API call)
    setTimeout(() => {
      setLoading(false);
      console.log("Register data:", data);

      setMessage("Akun berhasil dibuat!"); // Set success message
      // Remove navigation logic, keeping the user on the page
    }, 1500);  // Simulate API call delay
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Logo />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <RegisterForm
          onRegister={handleRegister}  // Pass handleRegister function
          loading={loading}
          error={error}
          message={message}  // Pass message to show success
          goLogin={() => navigate(`/login/${menuId}`)}  // Pass goLogin function for navigation (if needed)
        />
      </div>

      <RightPanel />
    </div>
  );
}

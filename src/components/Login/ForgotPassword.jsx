import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, useParams } from "react-router-dom";  // Import necessary hooks

export default function ForgotPassword({ onSubmit, error }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();  // Get location from the URL
  const { menuId: menuIdParam } = useParams(); // Get menuId from URL params (if exists)

  // Use menuId from location.state if available, otherwise fallback to URL params
  const menuIdFromLocation = location.state?.menuId || menuIdParam;

  // If menuId is not found, fallback to default value (1)
  const menuId = menuIdFromLocation || 1;  // Default to 1 if not found

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(""); // Reset message
    setLoading(true); // Start loading

    setTimeout(() => {
      setLoading(false); // End loading
      if (onSubmit) onSubmit(email);
      setMessage("Jika email terdaftar, link reset password telah dikirim.");
    }, 1500); // Simulate API call delay
  };

  return (
    <motion.div
      className="flex flex-col justify-center items-center w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Title & Subtitle */}
      <h2 className="text-2xl font-bold mb-2 text-center">Lupa Password</h2>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Masukkan email akun Anda untuk menerima instruksi reset password.
      </p>

      {/* Error Message */}
      {error && (
        <motion.div
          className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.div>
      )}

      {/* Success Message */}
      {message && (
        <motion.div
          className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {message}
        </motion.div>
      )}

      {/* Form */}
      <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Masukkan email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 
                     text-sm"
          required
          disabled={loading}
        />

        <motion.button
          type="submit"
          className="w-full py-2 sm:py-3 bg-indigo-600 text-white rounded-md shadow-lg 
                     hover:bg-indigo-700 transition disabled:opacity-50 
                     text-sm sm:text-base flex justify-center items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Loading...</span>
            </div>
          ) : (
            "Reset Password"
          )}
        </motion.button>
      </form>

      {/* Link back to login */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Sudah ingat password?{" "}
        <button
          onClick={() => navigate(`/login/${menuId}`, { replace: true })}  // Use the dynamic menuId
          className="cursor-pointer text-blue-500 hover:underline"
        >
          Sign In
        </button>
      </div>
    </motion.div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, useParams } from "react-router-dom"; // Added useLocation and useParams
import LoginInput from "./LoginInput";

const LoginForm = ({ onLogin, loading, error, goRegister }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { menuId: menuIdParam } = useParams(); // Get menuId from URL params

  // Prioritize the menuId from location.state, fallback to the URL params
  const menuIdFromLocation = location.state?.menuId || menuIdParam;
  const menuId = menuIdFromLocation || 1; // Default to 1 if menuId is not available

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
  if (!email || !password) {
    return onLogin({ error: "Email dan password wajib diisi !!" });
  }

  // CUKUP panggil login
  onLogin({ email, password });

  // ❗ Jangan redirect dari sini
};


  return (
    <motion.div
      className="w-full max-w-md space-y-4 px-4 sm:px-6 md:px-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Title */}
      <motion.div
        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        Sign In
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          className="text-xs sm:text-sm text-red-500 bg-red-100 rounded p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}

      {/* Email Input */}
      <LoginInput
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email or user name"
        size="small"
      />

      {/* Password Input */}
      <LoginInput
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        size="small"
      />

      {/* Forgot Password */}
      <div
        onClick={() => navigate(`/forgot-password/${menuId}`, { replace: true })} // Pass menuId in URL
        className="text-xs sm:text-sm text-right text-blue-500 hover:underline cursor-pointer"
      >
        Forgot password?
      </div>

      {/* Login Button */}
      <motion.button
        onClick={handleLogin}
        className="w-full py-2 sm:py-3 bg-indigo-600 text-white rounded-md shadow-lg 
                   hover:bg-indigo-700 transition disabled:opacity-50 text-sm sm:text-base"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Loading...</span>
          </div>
        ) : (
          "Login"
        )}
      </motion.button>

      {/* Switch to Register */}
      <div className="text-xs sm:text-sm text-center text-gray-500">
        Don’t have an account?{" "}
        <span
          onClick={goRegister}
          className="cursor-pointer text-blue-500 hover:underline"
        >
          Sign Up
        </span>
      </div>
    </motion.div>
  );
};

export default LoginForm;
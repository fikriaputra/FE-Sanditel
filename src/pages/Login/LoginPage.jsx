// src/pages/Login/LoginPage.jsx
import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import Logo from "../../components/Login/Logo";
import RightPanel from "../../components/Login/RightPanel";
import LoginForm from "../../components/Login/LoginForm";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { menuId: menuIdParam } = useParams(); // dari /login/:menuId

  // menuId: prioritas dari state, kalau tidak ada ambil dari URL param
  const menuIdFromParam = menuIdParam ? Number(menuIdParam) : null;
  const menuId =
    location.state?.menuId !== undefined && location.state?.menuId !== null
      ? Number(location.state.menuId)
      : menuIdFromParam;

  // Mapping id menu -> halaman tujuan
  const redirectMap = {
    1: "/dashboard",
    2: "/dashboard-laporan",
    // 3: "/monitoring-perangkat",
    // 4: "/dokumentasi-jaringan",
  };

  // redirectTo: prioritas dari state.redirectTo, kalau tidak ada pakai mapping id, terakhir fallback /menu
  const redirectTo =
    location.state?.redirectTo || redirectMap[menuId] || "/menu";

const handleLogin = async (data) => {
  if (data.error) {
    setError(data.error);
    return;
  }

  setError("");
  setLoading(true);

  try {
    const response = await fetch(
      "https://jungly-lathery-justin.ngrok-free.dev/api/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      }
    );

    const result = await response.json();

    const message = result.message?.toLowerCase() ?? "";
    if (
      message.includes("not") ||
      message.includes("match") ||
      message.includes("invalid") ||
      message.includes("record")
    ) {
      setError("Akun belum terdaftar. Silakan register terlebih dahulu.");
      setLoading(false);
      return;
    }

    if (!response.ok || !result.success) {
      setError(result.message || "Login gagal. Cek email & password.");
      setLoading(false);
      return;
    }

    // ✔ LOGIN SUKSES
    localStorage.setItem("token", result.access_token);
    localStorage.setItem("user", JSON.stringify(result.user));

    const role = result.user.role;

    setLoading(false);

    // 🔥 REDIRECT SESUAI URL PARAM & ROLE
    if (menuId === 2) {
      // login/1
      if (role === "admin") {
        navigate("/admin-dashboard-pekerjaan", { replace: true });
      } else {
        navigate("/dashboard-laporan", { replace: true });
      }
    } else if (menuId === 1) {
      // login/2
      navigate("/dashboard", { replace: true });
    } else {
      // fallback
      navigate("/menu", { replace: true });
    }

  } catch (err) {
    console.error(err);
    setError("Terjadi kesalahan. Periksa koneksi internet.");
    setLoading(false);
  }
};
    return (
      <div className="min-h-screen flex flex-col md:flex-row">
        <Logo />

        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
          <LoginForm
            onLogin={handleLogin}
            loading={loading}
            error={error}
            goRegister={() => navigate(`/register/${menuId}`)} // Fixed error: removed the comment inside JSX
          />
        </div>

        <RightPanel />
      </div>
    );
  }
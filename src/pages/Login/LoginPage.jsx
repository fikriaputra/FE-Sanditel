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

  const handleLogin = (data) => {
    if (data.error) {
      setError(data.error);
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      console.log("Login data:", data);
      console.log("menuId:", menuId);

      if (menuId === 1) {
        console.log("Login untuk Manajemen Inventaris");
      } else if (menuId === 2) {
        console.log("Login untuk Laporan Harian Pekerjaan");
      // } else if (menuId === 3) {
      //   console.log("Login untuk Monitoring Perangkat");
      // } else if (menuId === 4) {
      //   console.log("Login untuk Dokumentasi Jaringan");
      } else {
        console.log("Login langsung (tanpa pilih menu dulu)");
      }

      // Setelah login, redirect sesuai tujuan
      navigate(redirectTo, { replace: true });
    }, 1500);
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

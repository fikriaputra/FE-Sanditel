import { FaBars } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Navbar({ toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isImageError, setIsImageError] = useState(false); // fallback gambar
  const menuRef = useRef(null);

  // Mapping route ke judul halaman
  const pageTitles = {
    "/dashboard": "Dashboard",
    "/data-barang": "Data Barang",
    "/barang-masuk": "Barang Masuk",
    "/barang-keluar": "Barang Keluar",
    "/pengajuan-barang": "Pengajuan Barang",
    "/data-aset": "Data Aset",
    "/peminjaman-aset": "Peminjaman Aset",
    "/stok-opname": "Stok Opname",
    "/dashboard-laporan": "Dashboard",
    "/pekerjaan": "Pekerjaan",
    "/laporan": "Laporan",
    "/maintenance": "Maintenance",
    "/admin": "Admin Dashboard",
    "/admin-pekerjaan": "Admin Pekerjaan",
    "/admin-laporan": "Admin Laporan",
    "/admin-maintenance": "Admin Maintenance",
    
  };

  const currentTitle = pageTitles[location.pathname] || "Dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/menu");
  };

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white shadow p-3 sm:p-4 flex flex-wrap gap-2 justify-between items-center 
                    fixed top-0 left-0 right-0 z-50 lg:ml-64">
      {/* Tombol Toggle khusus HP */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden text-gray-700 p-2 rounded hover:bg-gray-100"
      >
        <FaBars className="w-5 h-5" />
      </button>

      {/* Judul Halaman Dinamis */}
      <h1 className="text-base sm:text-lg md:text-xl font-bold">{currentTitle}</h1>

      {/* Profile + Dropdown */}
      <div ref={menuRef} className="relative flex items-center gap-2 md:gap-4">
        <span className="text-gray-600 text-xs sm:text-sm md:text-base">Halo, Admin</span>

        {/* Foto profil atau fallback inicial */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="focus:outline-none"
        >
          {!isImageError ? (
            <img
              src="public/ChatGPT_Image_8_Agu_2025__23.59.29-removebg-preview (1).png"
              alt="User"
              onError={() => setIsImageError(true)} // kalau gagal, tampilkan inicial
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-gray-200 shadow-sm ring-1 ring-gray-100 transition hover:ring-blue-300"
            />
          ) : (
            <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold border border-gray-200 shadow-sm ring-1 ring-gray-100">
              A
            </div>
          )}
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg w-36 py-2 z-50 animate-fadeIn">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

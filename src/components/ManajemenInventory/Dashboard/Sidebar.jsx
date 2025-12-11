import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBars,
  FaBox,
  FaSignInAlt,
  FaSignOutAlt,
  FaClipboardList,
  FaDatabase,
  FaExchangeAlt,
  FaBoxes,
  FaChartPie,
  FaArrowLeft,
} from "react-icons/fa";

// ✅ Menu default (untuk user biasa)
const defaultMenus = [
  { name: "Dashboard", icon: <FaChartPie />, path: "/dashboard" },
  { name: "Data Barang", icon: <FaBox />, path: "/data-barang" },
  { name: "Data Aset", icon: <FaDatabase />, path: "/data-aset" },
  { name: "Barang Masuk", icon: <FaSignInAlt />, path: "/barang-masuk" },
  { name: "Barang Keluar", icon: <FaSignOutAlt />, path: "/barang-keluar" },
  // { name: "Pengajuan Barang", icon: <FaClipboardList />, path: "/pengajuan-barang" },
  { name: "Peminjaman Aset", icon: <FaExchangeAlt />, path: "/peminjaman-aset" },
  { name: "Stok Opname", icon: <FaBoxes />, path: "/stok-opname" },
];

export default function Sidebar({
  isOpen,
  setIsOpen,
  menus = defaultMenus,      // ✅ bisa override dari luar
  homePath = "/menu",        // ✅ bisa beda untuk admin: "/menu-admin"
}) {
  const navigate = useNavigate();
  const location = useLocation();  // 🔹 Menambahkan useLocation untuk mendapatkan path aktif

  return (
    <>
      {/* Tombol Toggle Mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[60] bg-gray-500 text-white p-2 rounded"
        onClick={() => setIsOpen(true)}
      >
        <FaBars className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black z-30 lg:hidden transition-opacity duration-300 ease-in-out
          ${isOpen ? "opacity-40 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 w-64
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
          lg:translate-x-0 lg:opacity-100 lg:w-64`}
      >
        {/* Header Logo */}
        <div
          className="p-4 text-lg font-bold border-b flex items-center gap-2 cursor-pointer"
          onClick={() => {
            setIsOpen(false);
            navigate(homePath);   // ✅ pakai homePath (user: /menu, admin: /menu-admin)
          }}
        >
          <img
            src="/Biro-Umum-Setda-Jabar.png"
            alt="Logo"
            className="w-8 h-8 object-contain"
          />
          SANDITEL App
        </div>

        {/* Tombol Kembali Mobile */}
        {isOpen && (
          <div className="lg:hidden p-4 border-b">
            <button
              className="flex items-center gap-2 text-gray-700 font-medium hover:text-blue-600"
              onClick={() => {
                setIsOpen(false);
                navigate(homePath);
              }}
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Kembali ke Menu</span>
            </button>
          </div>
        )}

        {/* Menu List */}
        <ul className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-60px)]">
          {menus.map((menu) => (
            <li
              key={menu.path}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors
                ${location.pathname === menu.path ? "bg-blue-100 text-blue-600" : "hover:bg-blue-100"}`}
              onClick={() => {
                setIsOpen(false);
                navigate(menu.path);
              }}
            >
              {menu.icon}
              <span>{menu.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

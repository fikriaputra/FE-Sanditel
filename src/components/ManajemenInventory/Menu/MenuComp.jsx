// src/components/ManajemenInventory/Menu/MenuComp.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, BarChart2 } from "lucide-react";
import CardMenu from "./CardMenu";

export default function MenuComp({
  variant = "default",
  backgroundImage,
  titlePrefix = "",
}) {
  const navigate = useNavigate();

  const menus = [
    {
      id: 1,
      title: "Manajemen Inventaris Barang",
      icon: Package,
      color: "from-teal-400 to-emerald-500",
      hoverColor: "from-teal-300 to-emerald-400",
      path: "/dashboard",
    },
    {
      id: 2,
      title: "Laporan Harian Pekerjaan",
      icon: BarChart2,
      color: "from-blue-400 to-indigo-500",
      hoverColor: "from-blue-300 to-indigo-400",
      path: "/dashboard-laporan",
    },
    // menu 3 & 4 bisa diaktifkan lagi nanti
  ];

  const twoMenus = menus.length === 2;

  const gridColsClass = twoMenus
    ? "grid-cols-1 md:grid-cols-2"
    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4";

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-start px-6 py-20 relative overflow-hidden bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background khusus untuk variant background */}
      {variant === "background" && backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mt-12">
        {/* Header */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Image and Text side by side */}
          <img
            src="/Biro-Umum-Setda-Jabar.png"
            alt="Logo"
            className="w-24 h-24 md:w-16 md:h-16"
          />
          <div className="flex flex-col items-start text-left">
            {/* Animated Text with Typewriter effect */}
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-gray-800 typewriter"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <span className="text-black-600">SANDITEL APPS</span>
            </motion.h1>
            <motion.p
              className="mt-1 text-sm md:text-base text-black-500 typewriter-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              Sistem Terpadu Manajemen & Dokumentasi Pekerjaan
            </motion.p>
          </div>
        </motion.div>

        {/* Grid Menu */}
        <div
          className={`grid ${gridColsClass} gap-6 justify-center ${
            twoMenus ? "max-w-4xl mx-auto" : ""
          }`}
        >
          {menus.map((menu, idx) => (
            <div key={menu.id} className="flex justify-center">
              {/* batasi lebar card */}
              <div className="w-full max-w-md">
                <CardMenu
                  icon={menu.icon}
                  title={`${titlePrefix}${menu.title}`}
                  color={menu.color}
                  hoverColor={menu.hoverColor}
                  onClick={() =>
                    navigate(`/login/${menu.id}`, {
                      state: {
                        redirectTo: menu.path,
                        menuId: menu.id,
                      },
                    })
                  }
                  index={idx}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

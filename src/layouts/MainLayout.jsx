import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/ManajemenInventory/Dashboard/Sidebar";
import Navbar from "./Navbar";

export default function MainLayout({ children, currentRoute }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        currentRoute={currentRoute} // Pass current route to Sidebar
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden 
                      transition-all duration-300
                      lg:ml-64">
        {/* Navbar */}
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 p-4 overflow-y-auto mt-16">
          {children}
        </main>
      </div>
    </div>
  );
}

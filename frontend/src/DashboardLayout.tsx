import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Navigation from "./components/Navigation";
import { Outlet } from "react-router-dom";

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar */}
      <header className="w-full h-14 bg-gray-800 text-white flex items-center justify-between px-6">
        <h1 className="text-lg font-semibold">Organizer</h1>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-700"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar (collapsible on mobile) */}
        <aside
          className={`fixed md:static inset-y-0 left-0 w-64 bg-gray-100 border-r border-gray-200 p-4 transform transition-transform duration-300 z-50
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <nav className="space-y-3 mt-10 md:mt-0">
            <Navigation />
          </nav>
        </aside>

        {/* Overlay when sidebar is open on mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 bg-white overflow-y-auto mt-2 md:mt-0">
          {<Outlet />}
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full h-12 bg-gray-800 text-white flex items-center justify-center">
        <p className="text-sm">&copy; 2025 My Dashboard</p>
      </footer>
    </div>
  );
};

export default DashboardLayout;

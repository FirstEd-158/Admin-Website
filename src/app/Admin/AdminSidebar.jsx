"use client";

import React, { useState } from "react";
import {
  FiHome,
  FiSettings,
  FiUsers,
  FiPlusSquare,
  FiDatabase,
} from "react-icons/fi";
import { GrSchedules } from "react-icons/gr";
import { useRouter } from "next/navigation";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/Admin" },
    { name: "Manage Users", icon: <FiUsers />, path: "/Admin/ManageUsers" },
    { name: "Add Domain", icon: <FiPlusSquare />, path: "/Admin/Domain" },
    { name: "Add Questions", icon: <FiPlusSquare />, path: "/Admin/AddQuestion" },
    { name: "Manage Questions", icon: <FiDatabase />, path: "/Admin/ManageQuestions" },
    { name: "Track Syllabus", icon: <GrSchedules />, path: "/Admin/Tracker" },
    { name: "Profile", icon: <FiSettings />, path: "/Admin/Profile" },
  ];

  return (
    <>
      

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 w-64 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-50`}
      >
        <nav className="mt-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                router.push(item.path);
                setIsOpen(false); // Close sidebar on mobile after navigation
              }}
              className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition"
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;

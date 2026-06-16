"use client";

import React from "react";
import { FiUsers, FiBook, FiClock, FiPlus, FiSettings, FiBarChart2 } from "react-icons/fi";

const AdminDashboard = () => {
  const stats = [
    { label: "Total Users", value: 2450, icon: <FiUsers />, color: "from-teal-400 to-blue-500" },
    { label: "Total Tests", value: 320, icon: <FiBook />, color: "from-purple-400 to-pink-500" },
    { label: "Pending Requests", value: 12, icon: <FiClock />, color: "from-yellow-400 to-orange-500" },
  ];

  const actions = [
    { label: "Create Test", icon: <FiPlus />, link: "/create-test" },
    { label: "Manage Tests", icon: <FiSettings />, link: "/manage-tests" },
    { label: "View Reports", icon: <FiBarChart2 />, link: "/reports" },
  ];

  const recentActivity = [
    { id: 1, action: "User Registered", detail: "John Doe signed up", time: "2 min ago" },
    { id: 2, action: "New Test Created", detail: "OS Mock Test", time: "1 hr ago" },
    { id: 3, action: "Test Attempted", detail: "DBMS Full Test by Jane", time: "3 hrs ago" },
  ];

  return (
    <div className="flex-1 p-6  text-white min-h-[calc(100vh-59px)]">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-lg bg-gradient-to-r ${stat.color} flex items-center gap-4`}
          >
            <div className="text-4xl">{stat.icon}</div>
            <div>
              <p className="text-sm">{stat.label}</p>
              <h2 className="text-2xl font-bold">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {actions.map((action, index) => (
          <a
            key={index}
            href={action.link}
            className="p-6 rounded-xl shadow-lg bg-white/10 backdrop-blur-lg border border-white/20 flex items-center gap-4 hover:bg-white/20 transition-all"
          >
            <div className="text-3xl">{action.icon}</div>
            <p className="font-medium">{action.label}</p>
          </a>
        ))}
      </div>

      {/* Activity */}
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden ">
        <table className="w-full text-left">
          <thead className="bg-white/20">
            <tr>
              <th className="p-3">Action</th>
              <th className="p-3">Detail</th>
              <th className="p-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((activity) => (
              <tr key={activity.id} className="border-b border-white/10 hover:bg-white/10">
                <td className="p-3">{activity.action}</td>
                <td className="p-3">{activity.detail}</td>
                <td className="p-3">{activity.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

"use client";
import React, { useState } from "react";

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "johndoe@example.com",
    mobile: "9876543210",
    gender: "Male",
    dob: "2000-01-01",
    address: "New Delhi, India",
    picture: null,
  });

  // track edit mode
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    setProfile({ ...profile, picture: URL.createObjectURL(e.target.files[0]) });
  };

  const handleSave = () => {
    console.log("Updated Profile:", profile);
    setIsEditing(false); // lock inputs again
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className=" bg-white/10 backdrop-blur-md shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          My Profile
        </h2>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={
              profile.picture ||
              "https://via.placeholder.com/100?text=Profile"
            }
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-3 text-sm"
            />
          )}
        </div>

        {/* Personal Info */}
        <div className="space-y-4">
          <input
            type="text"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded-lg ${
              isEditing ? " " : "  cursor-not-allowed"
            }`}
          />

          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded-lg ${
              isEditing ? " " : "  cursor-not-allowed"
            }`}
          />

          <input
            type="text"
            name="mobile"
            value={profile.mobile}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded-lg ${
              isEditing ? " " : "  cursor-not-allowed"
            }`}
          />

          <select
            name="gender"
            value={profile.gender}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full p-2 border rounded-lg ${
              isEditing ? " " : "  cursor-not-allowed"
            }`}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input
            type="date"
            name="dob"
            value={profile.dob}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded-lg ${
              isEditing ? " " : "  cursor-not-allowed"
            }`}
          />

          <textarea
            name="address"
            value={profile.address}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded-lg ${
              isEditing ? " " : "  cursor-not-allowed"
            }`}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6 gap-4">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

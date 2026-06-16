// "use client";

// import { useRouter } from "next/navigation";
// import React, { useState } from "react";
// import { FiBell, FiUser, FiLogOut } from "react-icons/fi";

// const Header = ({ title = "Dashboard", userName = "Guest" }) => {

//   const router = useRouter();
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const gotoPurchase=()=>{
//     setDropdownOpen(false);
//     router.push("/Users/MyTests");
//   }

//   const gotoProfile=()=>{
//     setDropdownOpen(false);
//     router.push("/Users/profile");
//   }

//   return (
//     <header className="w-full text-white shadow flex justify-between items-center px-6 py-3 relative">
//       {/* Page Title */}
//       <h2 className="text-xl font-semibold ">{title}</h2>

//       {/* Right Section */}
//       <div className="flex items-center gap-6 relative">
//         {/* Notifications */}
//         <button className=" hover:text-gray-800">
//           <FiBell size={20} />
//         </button>

//         {/* User Info */}
//         <div className="relative">
//           <button
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//             className="flex items-center gap-2 focus:outline-none"
//           >
//             <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
//               <FiUser />
//             </div>
//             <span className=" font-medium">{userName}</span>
//           </button>

//           {/* Dropdown */}
//           {dropdownOpen && (
//             <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border py-2 z-10">
//               <button
//                 className="w-full text-left px-4 py-2  hover:bg-gray-100"
//                 onClick={gotoProfile}
//               >
//                 Profile
//               </button>
//               <button
//                 className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
//                 onClick={gotoPurchase}
//               >
//                 My Purchases
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Logout */}
//         <button className="text-red-500 hover:text-red-600">
//           <FiLogOut size={20} />
//         </button>
//       </div>
//     </header>
//   );
// };

// export default Header;

"use client";
import React from "react";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-8 py-6 bg-[#203a43]/95 backdrop-blur-md shadow-md">
      <h1 className="text-2xl font-bold text-teal-400">GATE Tracker</h1>
      <nav className="space-x-6 md:flex">
        <a href="#features" className="hover:text-teal-300 transition">
          FEATURES
        </a>
        <a href="#about" className="hover:text-teal-300 transition">
          ABOUT
        </a>
        <a href="#contact" className="hover:text-teal-300 transition">
          CONTACT
        </a>
      </nav>
    </header>
  );
}

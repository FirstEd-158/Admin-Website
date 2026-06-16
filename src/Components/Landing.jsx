"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiBookOpen, FiCheckCircle, FiBarChart2 } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function LandingPage() {

  const [signin , Setsignin] = useState(1);

  const router = useRouter();

  const gototracter=()=>{
    if(signin) router.push("/Users/tracker");
    else router.push("/signin");
  }

  return (
    <div className="min-h-screen flex flex-col pt-15  text-gray-100">
      {/* Navbar */}
      

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold leading-tight mb-6"
        >
          Track Your <span className="text-teal-400">GATE Syllabus</span> <br />
          Stay Organized & Exam Ready
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl max-w-2xl mb-8 text-gray-300"
        >
          Our smart <span className="text-teal-300 font-medium">syllabus tracker</span> 
          helps you stay on top of your preparation.  
          Tick off completed topics and focus on what’s left.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 text-lg rounded-2xl shadow-lg bg-teal-500 hover:bg-teal-600 transition"
          onClick={gototracter}
        >
          Start Tracking
        </motion.button>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 px-8">
        <h3 className="text-3xl font-bold text-center text-teal-400 mb-12">Why Use Our Tracker?</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-[#2c5364] rounded-2xl shadow-lg text-center"
          >
            <FiBookOpen className="text-5xl text-teal-400 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-3">Organized Syllabus</h4>
            <p className="text-gray-300">
              Break down the GATE syllabus into manageable units and keep everything structured.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-[#2c5364] rounded-2xl shadow-lg text-center"
          >
            <FiCheckCircle className="text-5xl text-teal-400 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-3">Progress Tracking</h4>
            <p className="text-gray-300">
              Mark completed topics, track your progress, and stay motivated throughout your preparation.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-[#2c5364] rounded-2xl shadow-lg text-center"
          >
            <FiBarChart2 className="text-5xl text-teal-400 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-3">Visual Insights</h4>
            <p className="text-gray-300">
              See how much you’ve covered and what’s pending with a clean, user-friendly dashboard.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} GATE Tracker. All rights reserved.
      </footer>
    </div>
  );
}

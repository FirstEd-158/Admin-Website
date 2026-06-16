"use client"
import React, { useState } from 'react'
import { FiX } from "react-icons/fi";

const ManageQuestion = () => {
  const domains = {
    "Computer Science": ["Data Structures", "Algorithms", "DBMS"],
    "Electrical": ["Circuits", "Signals", "Machines"],
    "Mechanical": ["Thermodynamics", "Fluid Mechanics", "Manufacturing"],
  };

  const [selectedDomain, setSelectedDomain] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  const [domainDropdownOpen, setDomainDropdownOpen] = useState(false);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);

  const handleDomainChange = (domain) => {
    setSelectedDomain(domain);
    setSubjects(domains[domain] || []);
    setSelectedSubject("");
    setDomainDropdownOpen(false);
    setSubjectDropdownOpen(false);
  };

  return (
    <div className="px-2">
      {/* Domain Dropdown */}
      <label className="block mb-1 font-medium text-white">Select Domain</label>
      <div className="relative mb-4">
        <div
          onClick={() => {
            setDomainDropdownOpen(!domainDropdownOpen);
            setSubjectDropdownOpen(false);
          }}
          className="border rounded p-2 bg-white text-black flex justify-between items-center cursor-pointer"
        >
          <span>
            {selectedDomain ? selectedDomain : "-- Select Domain --"}
          </span>
          <span className="ml-2">{domainDropdownOpen ? "▲" : "▼"}</span>
        </div>

        {domainDropdownOpen && (
          <div className=" z-10 w-full mt-1 border rounded bg-white shadow 
                           overflow-y-auto">
            {Object.keys(domains).map((domain) => (
              <div
                key={domain}
                className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-black"
                onClick={() => handleDomainChange(domain)}
              >
                {domain}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subject Dropdown */}
      {selectedDomain && (
        <>
          <label className="block mb-1 font-medium text-white">Select Subject</label>
          <div className="relative mb-4">
            <div
              onClick={() => {
                setSubjectDropdownOpen(!subjectDropdownOpen);
                setDomainDropdownOpen(false);
              }}
              className="border rounded p-2 bg-white text-black flex justify-between items-center cursor-pointer"
            >
              <span>
                {selectedSubject ? selectedSubject : "-- Select Subject --"}
              </span>
              <span className="ml-2">{subjectDropdownOpen ? "▲" : "▼"}</span>
            </div>
            {subjectDropdownOpen && (
              <div className=" z-10 w-full mt-1 border rounded bg-white shadow 
                              max-h-40 overflow-y-auto">
                {subjects.map((subject) => (
                  <div
                    key={subject}
                    className="flex justify-between items-center px-2 py-1 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedSubject(subject);
                      setSubjectDropdownOpen(false);
                    }}
                  >
                    <span className="text-black">{subject}</span>
                    <span className="text-red-500 hover:text-red-700 cursor-pointer">
                      <FiX />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default ManageQuestion

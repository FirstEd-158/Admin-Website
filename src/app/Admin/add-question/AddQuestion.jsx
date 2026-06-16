"use client";
import { useState, useEffect } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { GetAllDomain } from "@/Helper/Services/domainService";
import { GetAllSubjects, AddSubject } from "@/Helper/Services/SubjectService";
import { toast } from "react-toastify";

const AddQuestion = () => {
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch all domains on load
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const result = await GetAllDomain();
        setDomains(result.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch domains!");
      }
    };
    fetchDomains();
  }, []);

  // Fetch subjects when domain changes
  const handleDomainChange = async (domainId) => {
    setSelectedDomain(domainId);
    setSelectedSubject("");
    setDropdownOpen(false);

    try {
      const result = await GetAllSubjects(domainId);
      setSubjects(result.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch subjects!");
      setSubjects([]);
    }
  };

  // Add subject to DB
  const handleAddSubject = async () => {
    if (!newSubject.trim()) {
      toast.warning("Subject name cannot be empty!");
      return;
    }
    if (!selectedDomain) {
      toast.warning("Please select a domain first!");
      return;
    }

    try {
      const data = { name: newSubject.trim() };
      const result = await AddSubject(data , selectedDomain);

      // result.data should contain the new subject (id + name)
      setSubjects([...subjects, result.data]);
      toast.success("Subject added successfully!");
      setNewSubject("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add subject!");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-blue-400">Add Question</h1>

      {/* Domain */}
      <label className="block mb-1 font-medium text-white">Select Domain</label>
      <select
        value={selectedDomain}
        onChange={(e) => handleDomainChange(e.target.value)}
        className="border rounded p-2 w-full mb-4 bg-white text-black"
      >
        <option value="">-- Select Domain --</option>
        {domains.map((domain) => (
          <option key={domain.id} value={domain.id}>
            {domain.name}
          </option>
        ))}
      </select>

      {/* Subject */}
      {selectedDomain && (
        <>
          <label className="block mb-1 font-medium text-white">
            Select Subject
          </label>
          <div className="flex gap-2 mb-4">
            {/* Custom Dropdown */}
            <div className="relative flex-1">
              {/* Dropdown Button */}
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="border rounded p-2 bg-white text-black flex justify-between items-center cursor-pointer"
              >
                <span>
                  {selectedSubject
                    ? subjects.find((s) => s.id === selectedSubject)?.name
                    : "-- Select Subject --"}
                </span>
                <span className="ml-2">{dropdownOpen ? "▲" : "▼"}</span>
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute z-10 w-full mt-1 border rounded bg-white shadow max-h-40 overflow-y-auto">
                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="flex justify-between items-center px-2 py-1 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedSubject(subject.id);
                        setDropdownOpen(false);
                      }}
                    >
                      <span className="text-black">{subject.name}</span>
                      <span className="text-red-500 hover:text-red-700 cursor-pointer">
                        <FiX />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Input for adding new subjects */}
            <input
              type="text"
              placeholder="Add new subject"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="border rounded p-2 flex-1 bg-white text-black"
            />
            <button
              onClick={handleAddSubject}
              className="bg-blue-600 text-white px-3 rounded"
            >
              <FiPlus />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddQuestion;

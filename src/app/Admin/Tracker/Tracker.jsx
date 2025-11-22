"use client";
import { AddDomain, DeleteDomain, GetAllDomain } from "@/Helper/Services/DomainService";
import { AddSubject, DeleteSubject, GetAllSubjects } from "@/Helper/Services/SubjectService";
// Assuming you have these services for subtopics as well
import { AddSubTopic, DeleteSubTopic, GetAllSubTopics } from "@/Helper/Services/SubTopicService";
import { AddTopic, DeleteTopic, GetAllTopics } from "@/Helper/Services/TopicService";
import React, { useState, useEffect } from "react";
import { Slide, toast} from "react-toastify";

// Mock services since the original path cannot be resolved in this environment.
// You can replace these with your actual service imports.

const SyllabusTracker = () => {
  // State for different levels of the syllabus
  const [domains, setDomains] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  // MODIFIED: Initial state is now an object to hold subtopics per topic
  const [subtopics, setSubtopics] = useState({});

  // State for selections and UI toggles
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [domainDropdownOpen, setDomainDropdownOpen] = useState(false);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);

  // States for expandable sections
  const [expandedTopic, setExpandedTopic] = useState("");

  // States for new item inputs
  const [newDomain, setNewDomain] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newTopicMarks, setNewTopicMarks] = useState("");
  const [newSubtopic, setNewSubtopic] = useState("");

  // --- State for managing the confirmation modal ---
  const [showPopup, setShowPopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // --- API Functions ---
  const handleFetchSubjects = async () => {
    try {
      const result = await GetAllSubjects(selectedDomain.id);
      setSubjects(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFetchTopics = async (subjectId) => {
    try {
      const result = await GetAllTopics(subjectId);
      setTopics(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  // MODIFIED: Fetches subtopics for a specific topic and stores them in the object
  const handleFetchSubtopics = async (topic) => {
    try {
      // Assuming you have a service to get all subtopics for a given topic ID
      const result = await GetAllSubTopics(topic.id);
      setSubtopics(prev => ({
        ...prev,
        [topic.id]: result.data || [] // Store subtopics in the object with topic.id as key
      }));
    } catch (error) {
      console.error(`Failed to fetch subtopics for ${topic.name}`, error);
    }
  };

  // --- Add Functions ---
  const handleAddDomain = async () => {
    if (!newDomain.trim() || domains.some(d => d.name === newDomain)) return;
    try {
      const result = await AddDomain({ name: newDomain });
      setDomains([...domains, result.data]);
      setNewDomain("");
      toast.success(`Domain ${newDomain} Added Successfully`, { position: 'top-center', transition: Slide });
    } catch (error) {
      console.error("Failed to add domain!", error);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject.trim() || !selectedDomain || subjects.some(s => s.name === newSubject)) return;
    try {
      const result = await AddSubject({ name: newSubject }, selectedDomain.id);
      setSubjects([...subjects, result.data]);
      setNewSubject("");
      toast.success(`Subject ${newSubject} Added Successfully`, { position: 'top-center', transition: Slide });
    } catch (error) {
      console.error("Failed to add subject!", error);
    }
  };

  const handleAddTopic = async () => {
    if (!newTopic.trim() || !newTopicMarks || !selectedSubject) return;
    try {
      const result = await AddTopic({ name: newTopic, marks: newTopicMarks }, selectedSubject.id);
      setTopics([...topics, result.data]);
      toast.success(`Topic ${newTopic} Added Successfully`, { position: 'top-center', transition: Slide });
      setNewTopic("");
      setNewTopicMarks("");
    } catch (error) {
      console.log(error);
    }
  };

  // MODIFIED: Correctly adds a new subtopic to the right topic's array
  const handleAddSubtopic = async (topic) => {
    if (!newSubtopic.trim()) return;
    try {
      const result = await AddSubTopic({ name: newSubtopic }, topic.id);
      const newSubtopicData = result.data;
      
      setSubtopics(prev => {
        const currentSubtopics = prev[topic.id] || [];
        return {
          ...prev,
          [topic.id]: [...currentSubtopics, newSubtopicData]
        };
      });

      toast.success(`Subtopic ${newSubtopic} Added Successfully`, { position: 'top-center', transition: Slide });
      setNewSubtopic("");
    } catch (error) {
      console.log(error);
    }
  };

  // --- Delete Functions ---
  const handleDeleteDomain = async (domainToDelete) => {
    try {
      await DeleteDomain(domainToDelete.id);
      setDomains(domains.filter(d => d.id !== domainToDelete.id));
      if (selectedDomain?.id === domainToDelete.id) {
        setSelectedDomain("");
        setSelectedSubject("");
      }
      toast.success(`Domain ${domainToDelete.name} Deleted Successfully`, { position: 'top-center', transition: Slide });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteSubject = async (subjectToDelete) => {
    try {
      await DeleteSubject(subjectToDelete.id);
      setSubjects(subjects.filter(s => s.id !== subjectToDelete.id));
      if (selectedSubject?.id === subjectToDelete.id) {
        setSelectedSubject("");
      }
      toast.success(`Subject ${subjectToDelete.name} Deleted Successfully`, { position: 'top-center', transition: Slide });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTopic = async (topicToDelete) => {
    try {
      await DeleteTopic(topicToDelete.id);
      setTopics(topics.filter(t => t.id !== topicToDelete.id));
      toast.success(`Topic ${topicToDelete.name} Deleted Successfully`, { position: 'top-center', transition: Slide });
    } catch (error)
    {
      console.log(error);
    }
  };
  
  // MODIFIED: Correctly removes a subtopic from the state object
  const handleDeleteSubtopic = async (topic, subtopicToDelete) => {
    try {
        await DeleteSubTopic(subtopicToDelete.id);
        const topicKey = topic.id;
        
        setSubtopics(prev => {
            const currentSubtopics = prev[topicKey] || [];
            const updatedSubtopics = currentSubtopics.filter(s => s.id !== subtopicToDelete.id);
            return {
                ...prev,
                [topicKey]: updatedSubtopics
            };
        });
        toast.success(`Subtopic ${subtopicToDelete.name} Deleted`, { position: 'top-center', transition: Slide });
    } catch (error) {
        console.error("Failed to delete subtopic", error);
    }
  };
  
  // --- Popup Functions ---
  const openDeleteConfirmation = (type, data) => {
    setItemToDelete({ type, data });
    setShowPopup(true);
  };
  
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const { type, data } = itemToDelete;

    switch (type) {
      case 'domain':
        handleDeleteDomain(data);
        break;
      case 'subject':
        handleDeleteSubject(data);
        break;
      case 'topic':
        handleDeleteTopic(data);
        break;
      default:
        console.error("Unknown delete type:", type);
    }
    
    setShowPopup(false);
    setItemToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowPopup(false);
    setItemToDelete(null);
  };

  // --- Effects for fetching data ---
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const result = await GetAllDomain();
        setDomains(result.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDomains();
  }, []);

  useEffect(() => {
    if (selectedDomain) {
      setSelectedSubject("");
      setTopics([]);
      setSubtopics({});
      handleFetchSubjects();
    } else {
      setSubjects([]);
    }
  }, [selectedDomain]);

  useEffect(() => {
    if (selectedSubject) {
      handleFetchTopics(selectedSubject.id);
    } else {
      setTopics([]);
    }
  }, [selectedSubject]);

  // --- Event Handlers for UI ---
  const toggleTopicExpansion = (topic) => {
    const topicKey = topic.id;
    const isExpanding = expandedTopic !== topicKey;
    setExpandedTopic(isExpanding ? topicKey : "");
    // Fetch only if expanding and data isn't already there
    if (isExpanding && !subtopics[topicKey]) {
      handleFetchSubtopics(topic);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen text-white font-sans bg-gray-900">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-purple-400">📚 Syllabus Editor</h1>

      {/* Domain Selection */}
      <div className="mb-6">
        <label className="block mb-1 font-medium text-gray-300">Select Domain</label>
        <div className="relative">
          <button onClick={() => setDomainDropdownOpen(!domainDropdownOpen)} className="border w-full text-left rounded p-2 bg-gray-800 border-gray-600 text-white flex justify-between items-center">
            <span>{selectedDomain?.name || "-- Select Domain --"}</span>
            <span>{domainDropdownOpen ? "▲" : "▼"}</span>
          </button>
          {domainDropdownOpen && (
            <div className="absolute z-20 w-full mt-1 border rounded bg-gray-800 border-gray-600 shadow-lg max-h-40 overflow-y-auto">
              {domains.map((d) => (
                <div key={d.id} className="flex justify-between items-center px-2 py-1 hover:bg-gray-700">
                  <span className="flex-1 cursor-pointer" onClick={() => { setSelectedDomain(d); setDomainDropdownOpen(false); }}>
                    {d.name}
                  </span>
                  <button className="text-red-500 hover:text-red-700" onClick={(e) => { e.stopPropagation(); openDeleteConfirmation('domain', d); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          <input type="text" placeholder="Add new domain" value={newDomain} onChange={(e) => setNewDomain(e.target.value)} className="flex-grow bg-gray-700 px-3 py-2 rounded text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <button onClick={handleAddDomain} className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors">Add</button>
        </div>
      </div>

      {/* Subject Selection */}
      {selectedDomain && (
        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-300">Select Subject</label>
          <div className="relative">
            <button onClick={() => setSubjectDropdownOpen(!subjectDropdownOpen)} className="border w-full text-left rounded p-2 bg-gray-800 border-gray-600 text-white flex justify-between items-center">
              <span>{selectedSubject.name || "-- Select Subject --"}</span>
              <span>{subjectDropdownOpen ? "▲" : "▼"}</span>
            </button>
            {subjectDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 border rounded bg-gray-800 border-gray-600 shadow-lg max-h-40 overflow-y-auto">
                {subjects.map((s) => (
                  <div key={s.id} className="flex justify-between items-center px-2 py-1 hover:bg-gray-700">
                    <span className="flex-1 cursor-pointer" onClick={() => { setSelectedSubject(s); setSubjectDropdownOpen(false); }}>
                      {s.name}
                    </span>
                    <button className="text-red-500 hover:text-red-700" onClick={(e) => { e.stopPropagation(); openDeleteConfirmation('subject', s); }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <input type="text" placeholder="Add new subject" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="flex-grow bg-gray-700 px-3 py-2 rounded text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <button onClick={handleAddSubject} className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors">Add</button>
          </div>
        </div>
      )}

      {/* Topics and Subtopics Section */}
      {selectedSubject && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-purple-300">Topics in {selectedSubject.name}</h2>
          <div className="space-y-3">
            {topics.map((topic) => {
              const topicKey = topic.id;
              const isTopicExpanded = expandedTopic === topicKey;
              return (
                <div key={topic.id} className="border rounded bg-gray-800/50 border-gray-700 p-4">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleTopicExpansion(topic)}>
                    <span className="font-medium flex-1">{topic.name} <span className="text-sm text-yellow-400">({topic.marks} marks)</span></span>
                    <div className="flex items-center gap-4">
                      <button className="text-red-400 hover:text-red-600" onClick={(e) => { e.stopPropagation(); openDeleteConfirmation('topic', topic); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                      <span>{isTopicExpanded ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {isTopicExpanded && (
                    <div className="mt-4 pt-4 pl-4 border-l-2 border-purple-500 space-y-2">
                      {/* MODIFIED: Access the correct array from the subtopics object */}
                      {(subtopics[topicKey] || []).map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between bg-gray-700/50 p-2 rounded">
                          <span>{sub.name}</span>
                          {/* MODIFIED: Pass both topic and subtopic to delete handler */}
                          <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteSubtopic(topic, sub)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2 pt-2">
                        <input type="text" placeholder="Add new subtopic" onKeyDown={(e) => e.key === 'Enter' && handleAddSubtopic(topic)} value={newSubtopic} onChange={(e) => setNewSubtopic(e.target.value)} className="flex-grow bg-gray-700 px-3 py-1 rounded text-white text-sm border border-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500" />
                        <button onClick={() => handleAddSubtopic(topic)} className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 text-sm transition-colors">Add</button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            {/* Add New Topic Form */}
            <div className="flex gap-2 pt-3">
              <input type="text" placeholder="New topic name" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} className="flex-grow bg-gray-700 px-3 py-2 rounded text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <input type="number" placeholder="Marks" value={newTopicMarks} onChange={(e) => setNewTopicMarks(e.target.value)} className="w-24 bg-gray-700 px-3 py-2 rounded text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <button onClick={handleAddTopic} className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors">Add Topic</button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6 w-[90%] max-w-md text-center">
            <h2 className="text-xl font-semibold text-white">
              Are you sure you want to delete <br />
              <span className="font-bold text-red-400">{itemToDelete?.data?.name}</span>?
            </h2>
            <div className="flex gap-4 mt-6">
              <button onClick={handleCancelDelete} className="flex-1 py-2 rounded-md bg-gray-600 text-white hover:opacity-80 transition">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="flex-1 py-2 rounded-md bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold shadow-md hover:scale-105 transition">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyllabusTracker;
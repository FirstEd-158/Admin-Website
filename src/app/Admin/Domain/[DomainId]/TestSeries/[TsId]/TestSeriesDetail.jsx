"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AddTestSections, GetAllTestSections } from "@/Helper/Services/TestSectionService";
import { AddTests, GetAllTestsofTestSeries } from "@/Helper/Services/TestService";

const TestSeriesDetail = () => {
    // Initial sections with some default tests
    const router = useRouter();
    const { DomainId, TsId } = useParams();
    const [sections, setSections] = useState([]);
    const [testDate, setTestDate] = useState("");
    const [testTime, setTestTime] = useState("");


    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await GetAllTestSections();
                const result2 = await GetAllTestsofTestSeries(TsId);
                const formatted = result.data.map(item => ({
                    id: item.id,
                    name: item.name,
                    tests: []
                }));

                result2.data.forEach(test => {
                    const targetSection = formatted.find(
                        sec => sec.id === test.test_section_id
                    );
                    if (targetSection) {
                        targetSection.tests.push({
                            id: test.id,
                            title: test.name,
                            questions: test.questions
                        });
                    }
                });
                setSections(formatted);
            } catch (error) {

            }
        };

        fetchData();
    }, []);

    const [newSectionName, setNewSectionName] = useState("");
    const [newTestTitle, setNewTestTitle] = useState("");
    const [addingSection, setAddingSection] = useState(false);
    const [addingTestSectionId, setAddingTestSectionId] = useState(null);

    // Add new section
    const addSection = async () => {
        if (!newSectionName.trim()) return alert("Section name cannot be empty");
        if (sections.find((s) => s.name.toLowerCase() === newSectionName.toLowerCase()))
            return alert("Section already exists");
        try {
            const result = await AddTestSections(newSectionName.trim());
            console.log(result);
            const newSection = {
                id: result.data.id,
                name: newSectionName.trim(),
                tests: [],
            };
            setSections([...sections, newSection]);
            setNewSectionName("");
            setAddingSection(false);
        } catch (error) {
            console.log(error);
        }


    };

    // Delete section
    const deleteSection = (id) => {
        if (confirm("Delete this section?")) {
            setSections(sections.filter((s) => s.id !== id));
        }
    };

    // Add test to a section
    const addTestToSection = async (sectionId) => {
        if (!newTestTitle.trim()) return alert("Test title cannot be empty");
        if (!testDate) return alert("Please select a date");
        if (!testTime) return alert("Please select a time");

        const isoStartTime = new Date(`${testDate}T${testTime}:00`).toISOString();

        try {
            const data = {
                name: newTestTitle,
                questions: [],
                test_section_id: sectionId,
                start_time: isoStartTime,
            };

            const result = await AddTests(TsId, data);
        } catch (error) {
            console.log(error);
        }

        // Update UI instantly
        setSections(
            sections.map((section) =>
                section.id === sectionId
                    ? {
                        ...section,
                        tests: [
                            ...section.tests,
                            { id: Date.now(), title: newTestTitle.trim() },
                        ],
                    }
                    : section
            )
        );

        // Reset UI states
        setNewTestTitle("");
        setTestDate("");
        setTestTime("");
        setAddingTestSectionId(null);
    };


    // Delete test from a section
    const deleteTestFromSection = (sectionId, testId) => {
        setSections(
            sections.map((section) =>
                section.id === sectionId
                    ? {
                        ...section,
                        tests: section.tests.filter((t) => t.id !== testId),
                    }
                    : section
            )
        );
    };

    const goToTestDetail = (TestId) => {
        router.push(`/Admin/Domain/${DomainId}/TestSeries/${TsId}/Test/${TestId}`);
    };

    

    return (
        <div className="p-8  min-h-[calc(100vh-59px)] text-white font-sans ">
            <h1 className="text-4xl font-extrabold mb-12 text-center drop-shadow-lg">
                Test Series Detail
            </h1>

           

            {/* Add Section */}
            {!addingSection ? (
                <div className="flex justify-center mb-12">
                    <button
                        onClick={() => setAddingSection(true)}
                        className="px-8 py-3 bg-gradient-to-r from-teal-400 to-blue-600 rounded-full text-black font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
                    >
                        + Add New Section
                    </button>
                </div>
            ) : (
                <div className="mb-12 flex flex-col md:flex-row gap-5 items-center justify-center w-full">
                    <input
                        type="text"
                        placeholder="Section Name"
                        value={newSectionName}
                        onChange={(e) => setNewSectionName(e.target.value)}
                        className="w-full md:w-96 px-5 py-3 rounded-2xl
               bg-white/90 backdrop-blur-md text-gray-900 placeholder-gray-600
               focus:outline-none focus:ring-4 focus:ring-teal-400 shadow-lg"
                        autoFocus
                    />
                    <button
                        onClick={addSection}
                        className="bg-gradient-to-r from-green-500 to-green-700 px-7 py-3 rounded-2xl 
               text-white font-semibold tracking-wide hover:scale-110 shadow-lg transition-all duration-300"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => {
                            setAddingSection(false);
                            setNewSectionName("");
                        }}
                        className="bg-gradient-to-r from-red-500 to-red-700 px-7 py-3 rounded-2xl 
               text-white font-semibold tracking-wide hover:scale-110 shadow-lg transition-all duration-300"
                    >
                        Cancel
                    </button>
                </div>

            )}

            {/* Sections */}
            <div className="space-y-12">
                {sections.map((section) => (
                    <div key={section.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{section.name}</h2>
                            <div>
                                <button
                                    onClick={() => deleteSection(section.id)}
                                    className="text-red-500 hover:text-red-700 font-bold text-xl rounded-full px-3 py-1 transition"
                                    title={`Delete section ${section.name}`}
                                >
                                    &times;
                                </button>
                            </div>
                        </div>

                        {/* Tests List */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                            {section.tests.map((test) => (
                                <div
                                    key={test.id}
                                    onClick={() => goToTestDetail(test.id)}
                                    className="bg-white/20 rounded-lg p-4 flex justify-between items-center shadow hover:bg-white/30 cursor-pointer transition"
                                >
                                    <span>{test.title}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteTestFromSection(section.id, test.id);
                                        }}
                                        className="text-red-400 hover:text-red-600 font-bold rounded-full px-2 py-1 transition"
                                        title={`Delete test ${test.title}`}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Test */}
                        {addingTestSectionId === section.id ? (
                            <div className="mb-12 flex flex-col md:flex-row flex-wrap gap-5 items-center justify-center w-full">

                                {/* Test Title */}
                                <input
                                    type="text"
                                    placeholder="Test Title"
                                    value={newTestTitle}
                                    onChange={(e) => setNewTestTitle(e.target.value)}
                                    className="w-full md:w-72 px-5 py-3 rounded-2xl
            bg-white/90 backdrop-blur-md text-gray-900 placeholder-gray-600
            focus:outline-none focus:ring-4 focus:ring-teal-400 shadow-lg"
                                    autoFocus
                                />

                                {/* Select Date */}
                                <input
                                    type="date"
                                    value={testDate}
                                    onChange={(e) => setTestDate(e.target.value)}
                                    className="w-full md:w-52 px-5 py-3 rounded-2xl
            bg-white/90 backdrop-blur-md text-gray-900
            focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-lg"
                                />

                                {/* Select Time */}
                                <input
                                    type="time"
                                    value={testTime}
                                    onChange={(e) => setTestTime(e.target.value)}
                                    className="w-full md:w-40 px-5 py-3 rounded-2xl
            bg-white/90 backdrop-blur-md text-gray-900
            focus:outline-none focus:ring-4 focus:ring-purple-400 shadow-lg"
                                />

                                {/* Save */}
                                <button
                                    onClick={() => addTestToSection(section.id)}
                                    className="bg-gradient-to-r from-green-500 to-green-700 px-7 py-3 rounded-2xl 
            text-white font-semibold tracking-wide hover:scale-110 shadow-lg transition-all duration-300"
                                >
                                    Save
                                </button>

                                {/* Cancel */}
                                <button
                                    onClick={() => {
                                        setAddingTestSectionId(null);
                                        setNewTestTitle("");
                                        setTestDate("");
                                        setTestTime("");
                                    }}
                                    className="bg-gradient-to-r from-red-500 to-red-700 px-7 py-3 rounded-2xl 
            text-white font-semibold tracking-wide hover:scale-110 shadow-lg transition-all duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setAddingTestSectionId(section.id)}
                                className="px-8 py-3 bg-gradient-to-r from-teal-400 to-blue-600 rounded-full text-black font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
                            >
                                + Add Test
                            </button>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestSeriesDetail;

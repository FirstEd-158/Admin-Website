"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { AddTestSections, GetAllTestSections } from "@/Helper/Services/TestSectionService";
import { AddTests, GetAllTestsofTestSeries } from "@/Helper/Services/TestService";

const TestSeriesDetail = () => {
    const router = useRouter();
    const { DomainId, TsId } = useParams();
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [testDate, setTestDate] = useState("");
    const [testTime, setTestTime] = useState("");
    const [duration, setDuration] = useState("");
    const [newSectionName, setNewSectionName] = useState("");
    const [newTestTitle, setNewTestTitle] = useState("");

    // UI Toggle States
    const [addingSection, setAddingSection] = useState(false);
    const [addingTestSectionId, setAddingTestSectionId] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);

        let sectionsData = [];
        let testsData = [];

        try {
            const sectionRes = await GetAllTestSections();
            sectionsData = sectionRes.data;

            setSections(
                sectionsData.map(section => ({
                    ...section,
                    tests: []
                }))
            );

        } catch (error) {
            console.error("Error fetching sections:", error);
            setLoading(false);
            return;
        }

        try {
            const testsRes = await GetAllTestsofTestSeries(TsId);
            testsData = testsRes.data;

            const formattedSections = sectionsData.map(section => ({
                ...section,
                tests: testsData
                    .filter(test => test.test_section_id === section.id)
                    .map(test => ({
                        id: test.id,
                        title: test.name,
                        questions: test.questions
                    }))
            }));

            setSections(formattedSections);

        } catch (error) {
            console.error("Error fetching tests:", error?.response?.data || error);
        }

        setLoading(false);

    }, [TsId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addSection = async () => {
        if (!newSectionName.trim()) return alert("Section name cannot be empty");

        try {
            const result = await AddTestSections(newSectionName.trim());

            const newSection = {
                id: result.data.id,
                name: newSectionName.trim(),
                tests: [],
            };

            setSections(prev => [...prev, newSection]);
            setNewSectionName("");
            setAddingSection(false);

        } catch (error) {
            console.error(error);
        }
    };
    const addTestToSection = async (sectionId) => {
        if (!newTestTitle.trim() || !testDate || !testTime || !duration) {
            return alert("Please fill all test details");
        }

        const isoStartTime = new Date(`${testDate}T${testTime}:00`).toISOString();
        try {
            const payload = {
                name: newTestTitle,
                questions: [],
                test_section_id: sectionId,
                start_time: isoStartTime,
                duration: Number(duration),
            };

            const result = await AddTests(TsId, payload);

            setSections(prevSections =>
                prevSections.map(section =>
                    section.id === sectionId
                        ? {
                            ...section,
                            tests: [
                                ...section.tests,
                                {
                                    id: result.data.id,
                                    title: newTestTitle.trim()
                                },
                            ],
                        }
                        : section
                )
            );

            setNewTestTitle("");
            setTestDate("");
            setTestTime("");
            setDuration("");
            setAddingTestSectionId(null);

        } catch (error) {
            console.error("Failed to add test:", error?.response?.data || error);
        }
    };

    const deleteSection = (id) => {
        if (confirm("Delete this section?")) {
            setSections(sections.filter((s) => s.id !== id));
        }
    };

    const deleteTestFromSection = (sectionId, testId) => {
        if (confirm("Delete this test?")) {
            setSections(prev =>
                prev.map((sec) =>
                    sec.id === sectionId
                        ? { ...sec, tests: sec.tests.filter((t) => t.id !== testId) }
                        : sec
                )
            );
        }
    };

    if (loading) return <div className="p-8 text-center text-white">Loading Test Details...</div>;

    return (
        <div className="p-8 min-h-[calc(100vh-59px)] text-white font-sans">
            <h1 className="text-4xl font-extrabold mb-12 text-center drop-shadow-lg">
                Test Series Detail
            </h1>

            {/* Add Section UI */}
            {!addingSection ? (
                <div className="flex justify-center mb-12">
                    <button
                        onClick={() => setAddingSection(true)}
                        className="px-8 py-3 bg-gradient-to-r from-teal-400 to-blue-600 rounded-full text-black font-semibold shadow-lg hover:scale-105 transition-transform"
                    >
                        + Add New Section
                    </button>
                </div>
            ) : (
                <div className="mb-12 flex flex-col md:flex-row gap-5 items-center justify-center">
                    <input
                        type="text"
                        placeholder="Section Name"
                        value={newSectionName}
                        onChange={(e) => setNewSectionName(e.target.value)}
                        className="w-full md:w-96 px-5 py-3 rounded-2xl bg-white text-gray-900"
                    />
                    <button onClick={addSection} className="bg-green-600 px-7 py-3 rounded-2xl font-semibold">Save</button>
                    <button onClick={() => setAddingSection(false)} className="bg-red-600 px-7 py-3 rounded-2xl font-semibold">Cancel</button>
                </div>
            )}

            {/* Sections List */}
            <div className="space-y-12">
                {sections.map((section) => (
                    <div key={section.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg">

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{section.name}</h2>
                            <button onClick={() => deleteSection(section.id)} className="text-red-500 text-2xl">&times;</button>
                        </div>

                        {/* Tests Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                            {section.tests.length === 0 ? (
                                <div className="text-gray-300 italic py-4">
                                    No tests available in this section.
                                </div>
                            ) : (
                                section.tests.map((test) => (
                                    <div
                                        key={test.id}
                                        onClick={() =>
                                            router.push(`/Admin/Domain/${DomainId}/TestSeries/${TsId}/Test/${test.id}`)
                                        }
                                        className="bg-white/20 rounded-lg p-4 flex justify-between items-center hover:bg-white/30 cursor-pointer transition"
                                    >
                                        <span>{test.title}</span>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteTestFromSection(section.id, test.id);
                                            }}
                                            className="text-red-400 hover:text-red-600 font-bold px-2"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add Test Form */}
                        {addingTestSectionId === section.id ? (
                            <div className="flex flex-wrap gap-4 justify-center bg-black/20 p-4 rounded-xl">

                                <input
                                    type="text"
                                    placeholder="Test Title"
                                    value={newTestTitle}
                                    onChange={(e) => setNewTestTitle(e.target.value)}
                                    className="px-4 py-2 rounded-lg text-black"
                                />

                                <input
                                    type="date"
                                    value={testDate}
                                    onChange={(e) => setTestDate(e.target.value)}
                                    className="px-4 py-2 rounded-lg text-black"
                                />

                                <input
                                    type="time"
                                    value={testTime}
                                    onChange={(e) => setTestTime(e.target.value)}
                                    className="px-4 py-2 rounded-lg text-black"
                                />

                                <input
                                    type="number"
                                    placeholder="Duration (seconds)"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="px-4 py-2 rounded-lg text-black"
                                />

                                <button
                                    onClick={() => addTestToSection(section.id)}
                                    className="bg-green-600 px-4 py-2 rounded-lg"
                                >
                                    Save
                                </button>

                                <button
                                    onClick={() => setAddingTestSectionId(null)}
                                    className="bg-red-600 px-4 py-2 rounded-lg"
                                >
                                    Cancel
                                </button>

                            </div>
                        ) : (
                            <button
                                onClick={() => setAddingTestSectionId(section.id)}
                                className="px-6 py-2 bg-blue-500 rounded-full text-white font-medium"
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
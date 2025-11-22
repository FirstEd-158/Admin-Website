"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GetAllDomain } from "@/Helper/Services/DomainService";
import { GetAllSubjects } from "@/Helper/Services/SubjectService";
import { GetAllQuestionsFromDomain, GetSingleTestquestion } from "@/Helper/Services/QuestionService";
import katex from "katex";
import "katex/dist/katex.min.css";
import { useParams } from "next/navigation";
import { GetSingleTest , UpdateTest  } from "@/Helper/Services/TestService";

const reOrder = (list, start, end) => {
  const result = Array.from(list);
  const [removed] = result.splice(start, 1);
  result.splice(end, 0, removed);
  return result;
};

const RichTextViewer = ({ content }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) {
      ref.current.querySelectorAll("span.ql-formula").forEach((node) => {
        if (!node.classList.contains("katex-processed")) {
          const latex = node.getAttribute("data-value") || "";
          try {
            node.innerHTML = katex.renderToString(latex, {
              throwOnError: false,
              displayMode: false,
            });
            node.classList.add("katex-processed");
          } catch {
            node.innerHTML = `<span class="text-red-500">Invalid formula</span>`;
          }
        }
      });
    }
  }, [content]);
  return <div ref={ref} dangerouslySetInnerHTML={{ __html: content || "" }} />;
};

const TestDetailPage = () => {
  const { DomainId, TsId, TestId } = useParams();

  // Main state
  const [questions, setQuestions] = useState([]); // test questions
  const [showForm, setShowForm] = useState(false);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjectList, setSubjectList] = useState([]);
  const [subjectCache, setSubjectCache] = useState({});
  const [testName, setTestName] = useState("");
  const [fetchedQuestions, setFetchedQuestions] = useState([]); // questions suggested to add
  const [expandedIds, setExpandedIds] = useState(new Set()); // for accordion toggle

  // New state for question type filter
  const [filterType, setFilterType] = useState("");

  // Load domains and test questions on mount
  useEffect(() => {
    const fetchDomainsAndQuestions = async () => {
      // Fetch domains
      const res = await GetAllDomain();
      setDomains(res.data || []);

      // Fetch test details
      const test = await GetSingleTest(TestId);
      setTestName(test.data.name);

      // Load test questions by IDs
      const questionIds = test.data.questions || [];
      if (questionIds.length > 0) {
        const questionPromises = questionIds.map((id) => GetSingleTestquestion(id));
        const questionResponses = await Promise.all(questionPromises);
        const questionsData = questionResponses.map((resp) => resp.data);
        setQuestions(questionsData);
      } else {
        setQuestions([]);
      }
    };
    fetchDomainsAndQuestions();
  }, [TestId]);

  // Handle domain selection
  const handleDomainSelect = async (id) => {
    setSelectedDomain(id);
    setSelectedSubject("");
    if (id) {
      if (subjectCache[id]) {
        setSubjectList(subjectCache[id]);
      } else {
        const subjRes = await GetAllSubjects(id);
        const subjects = subjRes.data || [];
        setSubjectList(subjects);
        setSubjectCache((prev) => ({ ...prev, [id]: subjects }));
      }
    } else {
      setSubjectList([]);
    }
  };

  // Fetch questions for the form, excluding already added questions
  const fetchQuestionsForForm = async (domainId) => {
    try {
      const res = await GetAllQuestionsFromDomain(domainId);
      const filtered = (res.data || []).filter((q) => !questions.find((pq) => pq.id === q.id));
      const formatted = filtered.map((q) => ({
        id: q.id,
        type: q.type.toUpperCase(),
        text: q.text,
        options: q.options || [],
        explanation: q.explanation,
      }));
      setFetchedQuestions(formatted);
    } catch {
      setFetchedQuestions([]);
    }
  };

  // Toggle expand/collapse in accordion
  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Refetch questions when form is shown or domain changes
  useEffect(() => {
    if (showForm && selectedDomain) {
      fetchQuestionsForForm(selectedDomain);
      setFilterType(""); // reset filter when domain changes or form shows
    } else {
      setFetchedQuestions([]);
      setFilterType("");
    }
  }, [showForm, selectedDomain]);

  // Add question from fetched to the test question list
  const addQuestionToTest = (question) => {
    if (!questions.some((q) => q.id === question.id)) {
      setQuestions((prev) => [...prev, question]);
    }
  };

  // Drag and drop reordering
  const onDragEnd = (result) => {
    if (!result.destination) return;
    setQuestions((prev) => reOrder(prev, result.source.index, result.destination.index));
  };

  // Delete question from test list
  const deleteQuestion = (id) => {
    if (confirm("Delete this question?")) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    }
  };

  // Save function to prepare test data to save (call API yourself)
  const saveTest = async() => {
    const dataToSave = {
      name: testName,
      questions: questions.map((q) => q.id),
    };
    try {
      const result = await UpdateTest(TestId , dataToSave)
    } catch (error) {
      
    }
    // Insert your API call here to save test with dataToSave
  };

  // Accordion header with toggle arrow
  const AccordionHeader = ({ id, onToggle, isExpanded, children }) => (
    <div
      className="flex items-center justify-between cursor-pointer select-none"
      onClick={() => onToggle(id)}
    >
      <div className="flex-1">{children}</div>
      <div className="ml-2 text-white font-bold select-none">{isExpanded ? "▲" : "▼"}</div>
    </div>
  );

  // Filter fetched questions based on selected type
  const filteredFetchedQuestions = filterType
    ? fetchedQuestions.filter((q) => q.type === filterType)
    : fetchedQuestions;

  return (
    <div className="p-8 min-h-[calc(100vh-59px)] text-white font-sans">
      <h1 className="text-4xl font-extrabold mb-10 text-center drop-shadow-lg">Manage {testName} Questions</h1>

      {/* Action buttons */}
      <div className="flex justify-center mb-12 space-x-4">
        <button
          onClick={() => setShowForm(true)}
          className="px-8 py-3 bg-gradient-to-r from-teal-400 to-blue-600 rounded-full text-black font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
        >
          + Add New Question
        </button>
        <button
          onClick={saveTest}
          className="px-8 py-3 bg-green-600 rounded-full text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
        >
          Save Test
        </button>
      </div>

      {/* Form for domain, subject selection and fetched questions */}
      {showForm && (
        <div className="bg-white/10 p-6 rounded-xl shadow-lg mb-10">
          {/* Domain Select */}
          <div>
            <label className="block mb-2 text-gray-300">Choose Domain</label>
            <select
              className="w-full p-2 mb-4 text-black rounded"
              value={selectedDomain}
              onChange={(e) => handleDomainSelect(e.target.value)}
            >
              <option value="">Select Domain</option>
              {domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Select */}
          {subjectList.length > 0 && (
            <>
              <label className="block mb-2 text-gray-300">Choose Subject</label>
              <select
                className="w-full p-2 mb-4 text-black rounded"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">Select Subject</option>
                {subjectList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Question type filter dropdown */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-300">Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-2 text-black rounded"
            >
              <option value="">All Types</option>
              <option value="MCQ">MCQ</option>
              <option value="MSQ">MSQ</option>
              <option value="NAT">NAT</option>
            </select>
          </div>

          {/* Fetched Questions to Add */}
          {filteredFetchedQuestions.length > 0 ? (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-white">Questions to Add</h3>
              <div className="max-h-96 overflow-y-auto space-y-4">
                {filteredFetchedQuestions.map((q) => {
                  const isExpanded = expandedIds.has(q.id);
                  return (
                    <div
                      key={q.id}
                      className="bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-lg"
                    >
                      <AccordionHeader
                        id={q.id}
                        onToggle={toggleExpand}
                        isExpanded={isExpanded}
                      >
                        <RichTextViewer content={q.text} />
                      </AccordionHeader>

                      {isExpanded && (
                        <>
                          {q.options.length > 0 && (
                            <ul className="list-disc pl-6 mt-4">
                              {q.options.map((opt, i) => (
                                <li
                                  key={i}
                                  className={opt.isCorrect ? "font-bold text-green-500" : "text-white"}
                                >
                                  <RichTextViewer content={opt.text} />
                                </li>
                              ))}
                            </ul>
                          )}
                          {q.explanation && (
                            <div className="mt-4">
                              <p className="font-semibold text-yellow-400">Explanation:</p>
                              <RichTextViewer content={q.explanation} />
                            </div>
                          )}
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={() => addQuestionToTest(q)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
                            >
                              Add to Test
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-400">No questions available for the selected filter.</p>
          )}

          <button
            onClick={() => setShowForm(false)}
            className="px-4 py-2 bg-red-500 text-white rounded mt-4"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Current Test Questions with Drag-and-Drop */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="questions" type="QUESTION">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {questions.map((q, index) => {
                const isExpanded = expandedIds.has(q.id);
                return (
                  <Draggable key={q.id} draggableId={`q-${q.id}`} index={index}>
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg"
                      >
                        <AccordionHeader
                          id={q.id}
                          onToggle={toggleExpand}
                          isExpanded={isExpanded}
                        >
                          <RichTextViewer content={q.text} />
                        </AccordionHeader>

                        {isExpanded && (
                          <>
                            {q.options.length > 0 && (
                              <ul className="list-disc pl-6 mt-4">
                                {q.options.map((opt, i) => (
                                  <li
                                    key={i}
                                    className={opt.isCorrect ? "font-bold text-green-500" : "text-white"}
                                  >
                                    <RichTextViewer content={opt.text} />
                                  </li>
                                ))}
                              </ul>
                            )}
                            {q.explanation && (
                              <div className="mt-4">
                                <p className="font-semibold text-yellow-400">Explanation:</p>
                                <RichTextViewer content={q.explanation} />
                              </div>
                            )}
                            <button
                              onClick={() => deleteQuestion(q.id)}
                              className="mt-2 text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TestDetailPage;

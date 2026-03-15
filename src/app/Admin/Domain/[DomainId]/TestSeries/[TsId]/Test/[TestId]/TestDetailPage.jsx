"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GetAllDomain } from "@/Helper/Services/DomainService";
import { GetAllSubjects } from "@/Helper/Services/SubjectService";
import { GetAllQuestionsFromSubject, GetQuestioninbulk, GetSingleTestquestion } from "@/Helper/Services/QuestionService";
import katex from "katex";
import "katex/dist/katex.min.css";
import { useParams } from "next/navigation";
import { GetSingleTest, UpdateTest } from "@/Helper/Services/TestService";
const reOrder = (list, start, end) => {
  const result = Array.from(list);
  const [removed] = result.splice(start, 1);
  result.splice(end, 0, removed);
  return result;
};

const RichTextViewer = ({ content }) => {
  const ref = React.useRef(null);
  useEffect(() => {
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
  const { TestId } = useParams();
  const [questions, setQuestions] = useState([]); 
  const [showForm, setShowForm] = useState(false);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjectList, setSubjectList] = useState([]);
  const [testName, setTestName] = useState("");
  const [fetchedQuestions, setFetchedQuestions] = useState([]); 
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(true);

  // Caching States
  const [subjectCache, setSubjectCache] = useState({}); // { domainId: subjects[] }
  const [questionCache, setQuestionCache] = useState({}); // { subjectId: questions[] }

  // Initial Data Load
  useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true);
        const [domainRes, testRes] = await Promise.all([
          GetAllDomain(),
          GetSingleTest(TestId)
        ]);

        setDomains(domainRes.data || []);
        setTestName(testRes.data.name);

        const questionIds = testRes.data.questions || [];
        if (questionIds.length > 0) {
          const res = await GetQuestioninbulk(questionIds);
          console.log(res);
          setQuestions(res.data);
        }
      } catch (err) {
        console.error("Init Error:", err);
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, [TestId]);

  // Domain Selection with Subject Caching
  const handleDomainSelect = async (id) => {
    setSelectedDomain(id);
    setSelectedSubject("");
    setFetchedQuestions([]); 
    if (id) {
      if (subjectCache[id]) {
        setSubjectList(subjectCache[id]);
      } else {
        const subjRes = await GetAllSubjects(id);
        const subjects = subjRes.data || [];
        setSubjectList(subjects);
        setSubjectCache(prev => ({ ...prev, [id]: subjects }));
      }
    } else {
      setSubjectList([]);
    }
  };

  // Fetch questions with Question Caching
  useEffect(() => {
    const fetchQuestions = async () => {
      if (selectedDomain && selectedSubject) {
        // 1. Check if questions for this subject are already in cache
        if (questionCache[selectedSubject]) {
          setFetchedQuestions(questionCache[selectedSubject]);
          return;
        }

        // 2. If not in cache, fetch from API
        try {
          const res = await GetAllQuestionsFromSubject(selectedSubject);
          const formatted = (res.data || []).map((q) => ({
            id: q.id,
            type: q.type.toUpperCase(),
            text: q.text,
            options: q.options || [],
            explanation: q.explanation,
            subject_id: q.subject_id 
          }));

          // 3. Save to cache and update state
          setQuestionCache(prev => ({ ...prev, [selectedSubject]: formatted }));
          setFetchedQuestions(formatted);
          
        } catch (err) {
          console.error("Fetch Error:", err);
        }
      } else {
        setFetchedQuestions([]);
      }
    };
    fetchQuestions();
  }, [selectedDomain, selectedSubject]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const addQuestionToTest = (question) => {
    if (!questions.some((q) => q.id === question.id)) {
      setQuestions((prev) => [...prev, question]);
    }
  };

  const deleteQuestion = (id) => {
    if (confirm("Remove this question?")) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    setQuestions((prev) => reOrder(prev, result.source.index, result.destination.index));
  };

  const saveTest = async () => {
    try {
      const payload = {
        name: testName,
        questions: questions.map((q) => q.id),
      };
      await UpdateTest(TestId, payload);
      alert("Test saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save test.");
    }
  };

  const availableQuestions = fetchedQuestions.filter(fq => 
    !questions.some(q => q.id === fq.id) && 
    (filterType === "" || fq.type === filterType) &&
    (fq.subject_id ? fq.subject_id.toString() === selectedSubject : true) 
  );

  if (loading) return <div className="p-8 text-center text-white">Loading Test Detail...</div>;

  return (
    <div className="p-8 min-h-[calc(100vh-59px)] text-white font-sans">
      <h1 className="text-4xl font-extrabold mb-10 text-center drop-shadow-lg">Manage {testName}</h1>

      <div className="flex justify-center mb-12 space-x-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-8 py-3 bg-gradient-to-r from-teal-400 to-blue-600 rounded-full text-black font-semibold shadow-lg hover:scale-105 transition-all"
        >
          {showForm ? "Close Panel" : "+ Add New Question"}
        </button>
        <button
          onClick={saveTest}
          className="px-8 py-3 bg-green-600 rounded-full text-white font-semibold shadow-lg hover:scale-105 transition-all"
        >
          Save Test
        </button>
      </div>

      {showForm && (
        <div className="bg-white/10 p-6 rounded-xl shadow-lg mb-10 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-sm text-gray-400">Choose Domain</label>
              <select
                className="w-full p-2 text-black rounded"
                value={selectedDomain}
                onChange={(e) => handleDomainSelect(e.target.value)}
              >
                <option value="">Select Domain</option>
                {domains.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-400">Choose Subject</label>
              <select
                className="w-full p-2 text-black rounded disabled:bg-gray-400"
                value={selectedSubject}
                disabled={!selectedDomain}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">Select Subject</option>
                {subjectList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-400">Question Type</label>
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
          </div>

          <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
            {!selectedSubject ? (
              <p className="text-center text-gray-400 py-10">Please select a Subject to load questions.</p>
            ) : availableQuestions.length > 0 ? (
              availableQuestions.map((q) => (
                <div key={q.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1" onClick={() => toggleExpand(q.id)}>
                      <RichTextViewer content={q.text} />
                    </div>
                    <button
                      onClick={() => addQuestionToTest(q)}
                      className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-xs font-bold transition"
                    >
                      ADD
                    </button>
                  </div>
                  {expandedIds.has(q.id) && (
                    <div className="mt-4 pt-4 border-t border-white/10 text-sm">
                      {q.options.map((opt, i) => (
                        <div key={i} className={`mb-2 ${opt.isCorrect ? "text-green-400 font-bold" : ""}`}>
                          • <RichTextViewer content={opt.text} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 italic py-10">No new questions found in this cache/subject.</p>
            )}
          </div>
        </div>
      )}

      {/* Main List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="questions-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {questions.map((q, index) => (
                <Draggable key={q.id.toString()} draggableId={q.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 shadow-lg group"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 flex-1" onClick={() => toggleExpand(q.id)}>
                          <span className="text-teal-400 font-bold">Q{index + 1}.</span>
                          <RichTextViewer content={q.text} />
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] bg-white/20 px-2 py-1 rounded text-gray-300">{q.type}</span>
                          <button onClick={() => deleteQuestion(q.id)} className="text-red-500 hover:text-red-700 font-bold text-xl">
                            &times;
                          </button>
                          <span className="text-gray-500 cursor-grab">☰</span>
                        </div>
                      </div>
                      
                      {expandedIds.has(q.id) && (
                        <div className="mt-4 pl-10 space-y-2 border-t border-white/5 pt-4">
                           {q.options.map((opt, i) => (
                             <div key={i} className={opt.isCorrect ? "text-green-400 font-semibold" : "text-gray-300"}>
                               <RichTextViewer content={opt.text} />
                             </div>
                           ))}
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TestDetailPage;
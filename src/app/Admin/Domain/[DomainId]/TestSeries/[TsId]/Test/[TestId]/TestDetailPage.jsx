"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GetAllDomain } from "@/Helper/Services/DomainService";
import { GetAllSubjects } from "@/Helper/Services/SubjectService";
import {
  GetAllQuestionsFromSubject,
  GetQuestioninbulk,
} from "@/Helper/Services/QuestionService";
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
            node.innerHTML =
              '<span class="text-red-500">Invalid formula</span>';
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
  const [subjectList, setSubjectList] = useState([]);

  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [testName, setTestName] = useState("");
  const [fetchedQuestions, setFetchedQuestions] = useState([]);

  const [expandedIds, setExpandedIds] = useState(new Set());

  const [filterType, setFilterType] = useState("");

  const [loading, setLoading] = useState(true);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [maxPage, setMaxPage] = useState(0);
  const [visiblePages, setVisiblePages] = useState([]);

  const [pageLoading, setPageLoading] = useState(false);

  /* ---------- INITIAL PAGE LOAD ---------- */

  useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true);

        const [domainRes, testRes] = await Promise.all([
          GetAllDomain(),
          GetSingleTest(TestId),
        ]);

        setDomains(domainRes.data || []);
        setTestName(testRes.data.name);

        const questionIds = testRes.data.questions || [];

        if (questionIds.length > 0) {
          const res = await GetQuestioninbulk(questionIds);
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

  /* ---------- LOAD SUBJECTS ---------- */

  const handleDomainSelect = async (id) => {
    setSelectedDomain(id);
    setSelectedSubject("");
    setFetchedQuestions([]);
    setPageNo(1);

    if (id) {
      try {
        const res = await GetAllSubjects(id);
        setSubjectList(res.data || []);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSubjectList([]);
    }
  };

  /* ---------- FETCH QUESTIONS ---------- */

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedSubject) return;

      try {
        setPageLoading(true);

        const res = await GetAllQuestionsFromSubject(
          selectedSubject,
          pageNo,
          pageSize
        );
        setMaxPage(res.data.total_pages);

        const formatted = (res.data.data || []).map((q) => ({
          id: q.id,
          type: q.type.toUpperCase(),
          text: q.text,
          options: q.options || [],
          explanation: q.explanation,
          subject_id: q.subject_id,
        }));

        setFetchedQuestions(formatted);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedSubject, pageNo, pageSize]);

  /* ---------- PAGINATION PAGE CALCULATION ---------- */

  useEffect(() => {
    
    setShowForm(false);

    setShowForm(true);

    setVisiblePages([]);

    const pages = [];

    if (maxPage <= 5) {
      for (let i = 1; i <= maxPage; i++) pages.push(i);
    } else {
      if (pageNo < 3) {
        pages.push(1, 2, 3,  "...", maxPage);
      } else if (pageNo >= maxPage - 2) {
        pages.push(1, "...", maxPage - 3, maxPage - 2, maxPage - 1, maxPage);
      } else {
        pages.push(1, "...", pageNo - 1, pageNo, pageNo + 1, "...", maxPage);
      }
    }

    setVisiblePages(pages);
  }, [pageNo, maxPage]);

  /* ---------- SAFETY PAGE CHECK ---------- */

  useEffect(() => {
    if (pageNo > maxPage) setPageNo(maxPage);
  }, [maxPage]);

  /* ---------- FUNCTIONS ---------- */

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
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

    setQuestions((prev) =>
      reOrder(prev, result.source.index, result.destination.index)
    );
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

  const availableQuestions = fetchedQuestions.filter(
    (fq) =>
      !questions.some((q) => q.id === fq.id) &&
      (filterType === "" || fq.type === filterType)
  );

  if (loading)
    return (
      <div className="p-8 text-center text-white">Loading Test...</div>
    );

  return (
    <div className="p-8 text-white">

      <h1 className="text-4xl font-bold text-center mb-10">
        Manage {testName}
      </h1>

      <div className="flex justify-center gap-4 mb-10">

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-blue-600 rounded"
        >
          {showForm ? "Close Panel" : "Add Questions"}
        </button>

        <button
          onClick={saveTest}
          className="px-6 py-2 bg-green-600 rounded"
        >
          Save Test
        </button>

      </div>

      {showForm && (
        <div className="bg-white/10 p-6 rounded-xl mb-10">

          {/* FILTERS */}

          <div className="grid md:grid-cols-3 gap-4 mb-6">

            <select
              className="p-2 text-black rounded"
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

            <select
              className="p-2 text-black rounded"
              disabled={!selectedDomain}
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setPageNo(1);
              }}
            >
              <option value="">Select Subject</option>
              {subjectList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 text-black rounded"
            >
              <option value="">All Types</option>
              <option value="MCQ">MCQ</option>
              <option value="MSQ">MSQ</option>
              <option value="NAT">NAT</option>
            </select>

            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="p-2 text-black rounded"
            >
              <option value="">Page Size</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>

          </div>

          {/* PAGINATION */}

          <div className="flex justify-center items-center gap-2 mb-6">

            <button
              disabled={pageNo === 1 || pageLoading}
              onClick={() => setPageNo((p) => Math.max(1, p - 1))}
              className="px-3 py-1 bg-white/10 rounded disabled:opacity-40"
            >
              {"<"}
            </button>


            {selectedDomain && selectedSubject && visiblePages.map((p, index) =>
              p === "..." ? (
                <span key={index + p} className="px-3 py-1 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  disabled={pageLoading}
                  onClick={() => setPageNo(p)}
                  className={`px-3 py-1 rounded ${
                    pageNo === p
                      ? "bg-yellow-500 text-black font-bold"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              disabled={pageNo === maxPage || pageLoading}
              onClick={() =>
                setPageNo((p) => Math.min(maxPage, p + 1))
              }
              className="px-3 py-1 bg-white/10 rounded disabled:opacity-40"
            >
              {">"}
            </button>

            {pageLoading && (
              <span className="ml-3 text-sm text-gray-400">
                Loading...
              </span>
            )}

          </div>

          {/* QUESTIONS */}

          <div className="max-h-96 overflow-y-auto space-y-4">

            {availableQuestions.length > 0 ? (
              availableQuestions.map((q) => (
                <div
                  key={q.id}
                  className="bg-white/5 p-4 rounded border border-white/10"
                >
                  <div className="flex justify-between">

                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => toggleExpand(q.id)}
                    >
                      <RichTextViewer content={q.text} />
                    </div>

                    <button
                      onClick={() => addQuestionToTest(q)}
                      className="px-3 py-1 bg-blue-600 rounded text-sm"
                    >
                      ADD
                    </button>

                  </div>

                  {expandedIds.has(q.id) && (
                    <div className="mt-3">

                      {q.options.map((opt, i) => (
                        <div
                          key={i}
                          className={
                            opt.isCorrect
                              ? "text-green-400"
                              : "text-gray-300"
                          }
                        >
                          <RichTextViewer content={opt.text} />
                        </div>
                      ))}

                    </div>
                  )}

                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">
                No Questions Found
              </p>
            )}

          </div>
        </div>
      )}

      {/* TEST QUESTIONS */}

      <DragDropContext onDragEnd={onDragEnd}>

        <Droppable droppableId="questions">

          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>

              {questions.map((q, index) => (

                <Draggable
                  key={q.id.toString()}
                  draggableId={q.id.toString()}
                  index={index}
                >

                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-white/10 p-4 mb-4 rounded"
                    >

                      <div className="flex justify-between">

                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => toggleExpand(q.id)}
                        >
                          <span className="text-teal-400 font-bold mr-2">
                            Q{index + 1}.
                          </span>
                          <RichTextViewer content={q.text} />
                        </div>

                        <button
                          onClick={() => deleteQuestion(q.id)}
                          className="text-red-500"
                        >
                          ✕
                        </button>

                      </div>

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
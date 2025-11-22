"use client";

import { AddTestSeries, DeleteTestSeries, GetAllTestSeries } from "@/Helper/Services/TestSeriesService";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Slide, toast } from "react-toastify";

const TestSeriesPage = () => {
  const { DomainId } = useParams();
  const router = useRouter();

  const [testSeriesList, setTestSeriesList] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const goToTestSeries = (TsId) => {
    router.push(`/Admin/Domain/${DomainId}/TestSeries/${TsId}`);
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewTitle("");
  };

  useEffect(() => {
    const fetchTestSeies = async () => {
      try {
        const result = await GetAllTestSeries(DomainId);


        setTestSeriesList(result.data || []); // ensure it's not undefined
      } catch (error) {

        toast.error("Failed to fetch domains!");
      }
    };

    fetchTestSeies();
  }, [DomainId]);

  const handleSave = async () => {
    if (!newTitle.trim()) {
      alert("Please enter a test series title");
      return;
    }

    const data = {
      name: newTitle,
      image_url: "https://actual-apricot-h40giqless.edgeone.app/FirstEd_TestSeries.png",
      old_price: 0,
      new_price: 0,
      type: 0,
      end_date: "2025-11-17T13:48:05.978Z",
      validity: 0
    }

    try {
      const result = await AddTestSeries(data, DomainId);
      setTestSeriesList([
        ...testSeriesList, result.data
      ]);
      setNewTitle("");
      setIsAdding(false);
      toast.success(`TestSeries ${data.name} Added Successfully`, { position: 'top-center', transition: Slide });
    } catch (error) {
      // console.log(error);

    }


  };

  const handleDelete = async (TS) => {
    if (confirm("Are you sure you want to delete this test series?")) {
      try {
        const result = await DeleteTestSeries(TS.id);
        console.log(result);
        setTestSeriesList(testSeriesList.filter((ts) => ts.id !== TS.id));

        toast.success(`TestSeries ${TS.name} Deleted Successfully`, { position: 'top-center', transition: Slide });
      } catch (error) {
        console.log(error);

      }

    }
  };

  return (
    <div className="p-8  min-h-[calc(100vh-59px)] text-white font-sans flex flex-col">
      <h1 className="text-4xl font-extrabold mb-10 text-center drop-shadow-lg tracking-wide">
        Test Series for <span className="text-teal-400">{DomainId}</span>
      </h1>

      {!isAdding ? (
        <div className="flex justify-center mb-8">
          <button
            onClick={handleAddClick}
            className="px-8 py-3 bg-gradient-to-r from-teal-400 to-blue-600 rounded-full text-black font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
          >
            + Add New Test Series
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Enter test series title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-md"
          />
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-green-500 to-green-700 px-6 py-2 rounded-lg text-white font-semibold hover:scale-105 shadow-md transition-all duration-300"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="bg-gradient-to-r from-red-500 to-red-700 px-6 py-2 rounded-lg text-white font-semibold hover:scale-105 shadow-md transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      )}

      {testSeriesList.length === 0 ? (
        <p className="text-center text-gray-300 text-lg mt-20">
          No test series available for this domain.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-8">
          {testSeriesList.map((ts) => (
            <li
              key={ts.id}
              className="relative bg-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:bg-white/25 hover:scale-[1.04] transition-all duration-300 cursor-pointer"
              title={`Go to ${ts.name}`}
              onClick={() => goToTestSeries(ts.id)}
            >
              <h2

                className="text-xl font-semibold mb-3 drop-shadow-md"
              >
                {ts.name}
              </h2>
              <p className="text-sm text-gray-300 mb-4">Click to view details & manage tests</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(ts);
                }}
                className="absolute top-4 right-4 text-red-400 hover:text-red-600 font-extrabold text-2xl rounded-full hover:bg-red-100/20 px-2 transition-colors duration-300 select-none"
                title="Delete Test Series"
                aria-label={`Delete ${ts.title}`}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TestSeriesPage;

"use client";

import {
  AddTestSeries,
  DeleteTestSeries,
  GetAllTestSeries,
} from "@/Helper/Services/TestSeriesService";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Slide, toast } from "react-toastify";

const TestSeriesPage = () => {
  const { DomainId } = useParams();
  const router = useRouter();

  const [testSeriesList, setTestSeriesList] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    image_url: "",
    old_price: 0,
    new_price: 0,
    type: 0,
    end_date: "",
    validity: 0,
    description: "",
    topic_wise_test: 0,
    subject_wise_test: 0,
    full_length_test: 0,
    total_test: 0,
  });

  const goToTestSeries = (TsId) => {
    router.push(`/Admin/Domain/${DomainId}/TestSeries/${TsId}`);
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setFormData({
      name: "",
      image_url: "",
      old_price: 0,
      new_price: 0,
      type: 0,
      end_date: "",
      validity: 0,
      description: "",
      topic_wise_test: 0,
      subject_wise_test: 0,
      full_length_test: 0,
      total_test: 0,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchTestSeries = async () => {
      try {
        const token = localStorage.getItem("accessToken") ?? "";
        const result = await GetAllTestSeries(DomainId , token);
        setTestSeriesList(result.data || []);
      } catch (error) {
        toast.error("Failed to fetch test series!");
      }
    };

    fetchTestSeries();
  }, [DomainId]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter test series name");
      return;
    }

    try {
      const result = await AddTestSeries(formData, DomainId);

      setTestSeriesList([...testSeriesList, result.data]);

      toast.success(`TestSeries ${formData.name} Added Successfully`, {
        position: "top-center",
        transition: Slide,
      });

      handleCancel();
    } catch (error) {
      toast.error("Failed to create test series");
    }
  };

  const handleDelete = async (TS) => {
    if (confirm("Are you sure you want to delete this test series?")) {
      try {
        await DeleteTestSeries(TS.id);

        setTestSeriesList(testSeriesList.filter((ts) => ts.id !== TS.id));

        toast.success(`TestSeries ${TS.name} Deleted Successfully`, {
          position: "top-center",
          transition: Slide,
        });
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete");
      }
    }
  };

  return (
    <div className="p-8 min-h-[calc(100vh-59px)] text-white font-sans flex flex-col">
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
        <div className="max-w-3xl mx-auto bg-white/10 p-6 rounded-2xl shadow-lg flex flex-col gap-4 mb-10">

          <input
            name="name"
            placeholder="Test Series Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-900"
          />

          <input
            name="image_url"
            placeholder="Image URL"
            value={formData.image_url}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-900"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-900"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="old_price"
              placeholder="Old Price"
              value={formData.old_price}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg bg-white/90 text-gray-900"
            />

            <input
              type="number"
              name="new_price"
              placeholder="New Price"
              value={formData.new_price}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg bg-white/90 text-gray-900"
            />

            <input
              type="number"
              name="type"
              placeholder="Type"
              value={formData.type}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg bg-white/90 text-gray-900"
            />

            <input
              type="number"
              name="validity"
              placeholder="Validity (days)"
              value={formData.validity}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg bg-white/90 text-gray-900"
            />

            <input
              type="datetime-local"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg bg-white/90 text-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="topic_wise_test"
              placeholder="Topic Wise Tests"
              value={formData.topic_wise_test}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg bg-white/90 text-gray-900"
            />

            <input
              type="number"
              name="subject_wise_test"
              placeholder="Subject Wise Tests"
              value={formData.subject_wise_test}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg bg-white/90 text-gray-900"
            />

            <input
              type="number"
              name="full_length_test"
              placeholder="Full Length Tests"
              value={formData.full_length_test}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg bg-white/90 text-gray-900"
            />

            <input
              type="number"
              name="total_test"
              placeholder="Total Tests"
              value={formData.total_test}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg bg-white/90 text-gray-900"
            />
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handleSave}
              className="bg-green-600 px-6 py-2 rounded-lg font-semibold hover:scale-105"
            >
              Save
            </button>

            <button
              onClick={handleCancel}
              className="bg-red-600 px-6 py-2 rounded-lg font-semibold hover:scale-105"
            >
              Cancel
            </button>
          </div>
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
              <h2 className="text-xl font-semibold mb-3">{ts.name}</h2>

              <p className="text-sm text-gray-300 mb-4">
                Click to view details & manage tests
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(ts);
                }}
                className="absolute top-4 right-4 text-red-400 hover:text-red-600 font-extrabold text-2xl"
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
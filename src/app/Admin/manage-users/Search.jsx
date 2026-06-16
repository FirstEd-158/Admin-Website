"use client"
import React, { useState } from "react";

const Search = () => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", query);
    // here you can add API call / filter logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-6">
      <div className="bg-white shadow-lg rounded-2xl p-2 w-full max-w-md">
       
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type to search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;

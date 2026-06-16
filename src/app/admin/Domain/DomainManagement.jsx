"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AddDomain, DeleteDomain, GetAllDomain } from "@/Helper/Services/DomainService";
import { Slide, toast } from "react-toastify";

const DomainManagement = () => {
  const router = useRouter();
  const [domains, setDomains] = useState([]);
  const [newDomain, setNewDomain] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Fetch all domains on page load
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const result = await GetAllDomain();
        setDomains(result.data || []); // ensure it's not undefined
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch domains!");
      }
    };

    fetchDomains();
  }, []);

  const handleAddDomain = async () => {
    if (!newDomain.trim()) return alert("Domain name cannot be empty");

    const exists = domains.find(
      (d) => d.name.toLowerCase() === newDomain.trim().toLowerCase()
    );
    if (exists) return alert("Domain already exists");

    const data = { name: newDomain };

    try {
      const result = await AddDomain(data);

      setDomains([
        ...domains,
        { id: result.data.id, name: newDomain.trim() },
      ]);

      toast.success("Domain Added Successfully", { position: 'top-center', transition: Slide });
    } catch (error) {
      console.error(error);
      toast.error("Adding failed try again!");
    }

    setNewDomain("");
    setIsAdding(false);
  };

  const handleDeleteDomain = (id) => {
    console.log(id);
    
    if (confirm("Are you sure you want to delete this domain?")) {
      try {
        DeleteDomain(id);
        setDomains(domains.filter((d) => d.id !== id));
        toast.success(`Domain Deleted Successfully`, { position: 'top-center', transition: Slide });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const goToDomainTests = (domain) => {
    router.push(`/admin/domain/${domain.id}`);
  };

  return (
    <div className="p-8 min-h-[calc(100vh-59px)] text-white font-sans flex flex-col">
      <h1 className="text-5xl font-extrabold mb-12 text-center tracking-wider drop-shadow-lg">
        Manage Domains
      </h1>

      {!isAdding ? (
        <div className="flex justify-center mb-12">
          <button
            onClick={() => setIsAdding(true)}
            className="px-8 py-3 bg-gradient-to-r from-teal-400 to-blue-600 rounded-full text-black font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
          >
            + Add New Domain
          </button>
        </div>
      ) : (
        <div className="mb-12 flex flex-col sm:flex-row gap-5 items-center justify-center">
          <input
            type="text"
            placeholder="Enter domain name"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            className="flex-grow sm:flex-none sm:w-96 px-5 py-3 rounded-2xl
                       bg-white/90 backdrop-blur-md text-gray-900 placeholder-gray-600
                       focus:outline-none focus:ring-4 focus:ring-teal-400 shadow-lg"
          />
          <button
            onClick={handleAddDomain}
            className="bg-gradient-to-r from-green-500 to-green-700 px-7 py-3 rounded-2xl text-white font-semibold tracking-wide hover:scale-110 shadow-lg transition-all duration-300"
          >
            Save
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setNewDomain("");
            }}
            className="bg-gradient-to-r from-red-500 to-red-700 px-7 py-3 rounded-2xl text-white font-semibold tracking-wide hover:scale-110 shadow-lg transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-6">
        {domains.map((domain) => (
          <div
            key={domain.id}
            onClick={() => goToDomainTests(domain)}
            className="cursor-pointer rounded-2xl p-5 sm:p-6 md:p-8
                   bg-white/10 backdrop-blur-lg border border-white/30 shadow-lg
                   flex items-center justify-between
                  hover:bg-white/25 hover:scale-[1.03] transition-transform duration-300"
            title={`Manage tests in ${domain.name}`}
          >
            {/* Left side: Domain Name */}
            <span className="text-lg sm:text-xl md:text-2xl font-semibold text-white drop-shadow-lg break-words">
              {domain.name}
            </span>

            {/* Right side: Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteDomain(domain.id);
              }}
              className="ml-4 text-red-400 hover:text-red-600 font-extrabold
                     text-2xl sm:text-3xl rounded-full
                    hover:bg-red-100/20 px-2 transition-colors duration-300 select-none"
              title="Delete Domain"
              aria-label={`Delete ${domain.name}`}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DomainManagement;

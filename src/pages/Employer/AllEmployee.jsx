import React, { useEffect, useState } from "react";
import { GetComOrEmp } from "../../utils/Api";
import { LoadMore } from "../../component";
import { fallback } from "../../assets";
import LayoutCards from "../../component/Employer/LayoutCards";
import { BsBackpack } from "react-icons/bs";
import { LuSearch } from "react-icons/lu";

const AllEmployees = () => {
  const [jobs, setJobs] = useState([]); // Original jobs data
  const [filteredJobs, setFilteredJobs] = useState([]); // Filtered jobs after search
  const [visibleJobsCount, setVisibleJobsCount] = useState(4); // Initially show 4 jobs
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  const hasMore = filteredJobs.length > visibleJobsCount;

  const handleLoadMore = () => {
    setVisibleJobsCount((prevCount) => prevCount + 4); // Load 4 more jobs
  };

  const handleSearch = (searchText) => {
    setSearchTerm(searchText); // Update searchTerm
    const lowerCaseSearch = searchText.toLowerCase();
    const filtered = lowerCaseSearch
      ? jobs.filter(
          (job) =>
            job.name?.toLowerCase().includes(lowerCaseSearch) ||
            job.employer?.location?.toLowerCase().includes(lowerCaseSearch)
        )
      : jobs; // Reset to full list if search input is empty
    setFilteredJobs(filtered);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await GetComOrEmp("employee");
        setJobs(response);
        setFilteredJobs(response); // Initialize filteredJobs with full data
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  
  const transformedProfiles = filteredJobs.map((job) => ({
    bannerImg: job?.banner || fallback, // Fallback banner image
    image: job?.employee?.image || fallback, // Fallback logo image
    title: job?.name || "No Title Provided",
    description: job?.short_description || "No Description Available",
    location: job?.employee?.location || "Location Not Available",
    layout: job?.layout || "1", // Default layout
    id: job?.id,
  }));

  return (
    <div className="container my-10 px-0">
      <div className="flex justify-between items-center">
        <span className="py-2 w-auto border outline-none focus:bg-gray-50 bg-white text-black rounded-site text-sm duration-200 border-gray-200 flex justify-between shadow-lg">
          <span className="flex items-center">
            <BsBackpack size={18} className="mx-3" />
            <input
              type="text"
              placeholder="Job title or keywords"
              className="w-full outline-none"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </span>
          <LuSearch
            size={24}
            className="bg-tn_primary mr-2 rounded-full w-8 h-8 py-1 px-2 text-white"
            onClick={() => handleSearch(searchTerm)}
          />
        </span>
      </div>
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {transformedProfiles.length === 0 ? (
            <h2 className="col-span-4 text-start">No company found</h2>
          ) : (
            transformedProfiles.slice(0, visibleJobsCount).map((profile, index) => (
              <LayoutCards key={index} profile={profile} layout={profile.layout} type={"employee"} />
            ))
          )}
        </div>
        {hasMore && (
          <LoadMore
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            className="mt-5"
          />
        )}
      </div>
    </div>
  );
};

export default AllEmployees;

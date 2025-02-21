import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function HomeHero() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [listings, setListings] = useState([]); // Stores all property data
  const navigate = useNavigate();

  // Fetch office locations from Firebase (Realtime Database)
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          "https://officenest-380c1-default-rtdb.firebaseio.com/properties.json"
        );
        const data = response.data;
  
        if (data) {
          const listingsArray = Object.entries(data).map(([key, value]) => ({
            id: key, // Firebase key as ID
            ...value,
          }));
  
          console.log("Fetched Listings:", listingsArray); // Debugging log
  
          setListings(listingsArray);
          setLocations(listingsArray.map((office) => office.location));
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
  
    fetchLocations();
  }, []);
  
  

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredLocations([]);
    } else {
      const filtered = locations.filter((location) =>
        location.toLowerCase().includes(value)
      );
      setFilteredLocations(filtered);
    }
  };

  // Handle selecting a location and navigate with listing data
  const handleSelectLocation = (location) => {
    setSearchTerm(location);
    setFilteredLocations([]);
  
    console.log("Selected Location:", location); // Debugging log
    console.log("All Listings:", listings); // Log all listings
  
    const selectedListing = listings.find((office) => office.location.toLowerCase() === location.toLowerCase());
  
    if (selectedListing) {
      console.log("Navigating to:", `/properties/${selectedListing.id}`); // Debugging log
      navigate(`/properties/${selectedListing.id}`);
    } else {
      console.error("Office data not found for selected location:", location);
    }
  };
  

  return (
    <>
      <div className="relative w-full h-screen flex items-center text-white">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="https://videos.pexels.com/video-files/8347237/8347237-uhd_2560_1440_25fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#051A6C]/90 clip-diagonal"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl px-10 lg:px-20">
          <h1 className="text-3xl md:text-4xl max-w-[500px] mb-[40px] font-bold">
            A Flexible Way to Work, A Faster Way to Rent!
          </h1>
          <p className="mt-4 text-md max-w-[500px] text-white">
            Explore modern office rentals tailored for freelancers, startups, and established teams. 
            Flexible terms, premium locations, and effortless booking—all in one place.
          </p>

          {/* Search Bar */}
          <div className="mt-6 flex items-center max-w-[800px] relative">
            <div className="relative w-[300px]" id="input">
              <input
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by location..."
                className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-slate-200 focus:outline-none"
                type="text"
              />
              <div className="absolute top-3 right-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="slate-300" viewBox="0 0 24 24" height="24" width="24">
                  <path d="M10.979 16.8991C11.0591 17.4633 10.6657 17.9926 10.0959 17.9994C8.52021 18.0183 6.96549 17.5712 5.63246 16.7026C4.00976 15.6452 2.82575 14.035 2.30018 12.1709C1.77461 10.3068 1.94315 8.31525 2.77453 6.56596C3.60592 4.81667 5.04368 3.42838 6.82101 2.65875C8.59833 1.88911 10.5945 1.79039 12.4391 2.3809C14.2837 2.97141 15.8514 4.21105 16.8514 5.86977C17.8513 7.52849 18.2155 9.49365 17.8764 11.4005C17.5979 12.967 16.8603 14.4068 15.7684 15.543C15.3736 15.9539 14.7184 15.8787 14.3617 15.4343C14.0051 14.9899 14.0846 14.3455 14.4606 13.9173C15.1719 13.1073 15.6538 12.1134 15.8448 11.0393C16.0964 9.62426 15.8261 8.166 15.0841 6.93513C14.3421 5.70426 13.1788 4.78438 11.81 4.34618C10.4412 3.90799 8.95988 3.98125 7.641 4.55236C6.32213 5.12348 5.25522 6.15367 4.63828 7.45174C4.02135 8.74982 3.89628 10.2276 4.28629 11.6109C4.67629 12.9942 5.55489 14.1891 6.75903 14.9737C7.67308 15.5693 8.72759 15.8979 9.80504 15.9333C10.3746 15.952 10.8989 16.3349 10.979 16.8991Z"></path>
                  <rect transform="rotate(-49.6812 12.2469 14.8859)" rx="1" height="10.1881" width="2" y="14.8859" x="12.2469"></rect>
                </svg>
              </div>

              {/* Search Results Dropdown */}
              {filteredLocations.length > 0 && (
                <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-40 overflow-y-auto">
                  {filteredLocations.map((location, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-black"
                      onClick={() => handleSelectLocation(location)}
                    >
                      {location}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

                   {/* CTA Button */}
                   <button className="overflow-hidden mt-[30px] relative w-52 p-2 h-10 bg-black text-white border-none rounded-md text-md font-bold cursor-pointer relative z-10 group">
            <Link to="/offices">
            Book Your Space Now
            <span className="absolute w-36 h-32 -top-8 -left-2 bg-white rotate-8 transform scale-x-0 group-hover:scale-x-200 transition-transform group-hover:duration-500 duration-1000 origin-left"></span>
            <span className="absolute w-36 h-32 -top-8 -left-2 bg-[#0C2BA1] rotate-8 transform scale-x-0 group-hover:scale-x-200 transition-transform group-hover:duration-700 duration-700 origin-left"></span>
            <span className="absolute w-36 h-32 -top-8 -left-2 bg-[#00104B] rotate-8 transform scale-x-0 group-hover:scale-x-200 transition-transform group-hover:duration-1000 duration-500 origin-left"></span>
            <span className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-18 z-10">
              Explore!
            </span>
            </Link>
          </button>
        </div>

        {/* Custom Clip Path for Diagonal Shape */}
        <style>{`
            .clip-diagonal {
            clip-path: polygon(0 0, 50% 0, 35% 100%, 0% 100%);
            }
        `}</style>
      </div>
    </>
  );
}

export default HomeHero;
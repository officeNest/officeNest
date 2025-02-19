import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOffices } from "../features/PropertyListingsSlice";
import { FaListUl, FaChevronDown } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

// Filter options
const workspaceOptions = [
  { name: "All Workspaces", description: "Show all available workspaces" },
  { name: "Serviced Offices", description: "Dedicated office space for teams" },
  {
    name: "Coworking Spaces",
    description: "Shared workspace with flexible seating",
  },
  {
    name: "Commercial Spaces",
    description: "Business address with remote services",
  },
];

function ImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="relative w-full h-65">
      <img
        src={images[currentIndex]}
        alt="Property"
        className="w-full h-65 object-cover rounded-md"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 bg-white bg-opacity-50 text-[#0C2BA1] p-2 rounded-full transform -translate-y-1/2"
          >
            &#10094;
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 bg-white bg-opacity-50 text-[#0C2BA1] p-2 rounded-full transform -translate-y-1/2"
          >
            &#10095;
          </button>
        </>
      )}
    </div>
  );
}

const PropertyListings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const Properties = useSelector((state) => state.offices.offices);
  const [filter, setFilter] = useState("All Workspaces");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          "https://officenest-380c1-default-rtdb.firebaseio.com/properties.json"
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        // Convert Firebase object to an array of properties with `id` field
        const propertiesArray = Object.keys(data).map((key) => ({
          id: key, // Use the Firebase key as the `id`
          ...data[key],
        }));

        // Dispatch the `setOffices` action
        dispatch(setOffices(propertiesArray));
      } catch (error) {
        console.error("Error fetching Properties:", error);
      }
    };
    fetchProperties();
  }, [dispatch]);

  function WorkspaceFilter({ onFilterChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(workspaceOptions[0]);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between px-4 py-2 border rounded-full text-gray-700 shadow-sm hover:shadow-md border-[#0C2BA1] text-[#0C2BA1]"
        >
          {selectedOption.name}{" "}
          <FaChevronDown className="ml-2 text-[#0C2BA1]" />
        </button>
        {isOpen && (
          <div className="absolute left-0 w-72 mt-2 bg-white rounded-lg shadow-lg border p-2 z-10">
            {workspaceOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedOption(option);
                  setIsOpen(false);
                  onFilterChange(option.name);
                }}
                className={`flex items-start p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  selectedOption.name === option.name
                    ? "text-[#0C2BA1] font-semibold"
                    : "text-gray-800"
                }`}
              >
                <div className="ml-2">
                  <p>{option.name}</p>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function ProList({ filteredType }) {
    const filteredListings =
      filteredType === "All Workspaces"
        ? Properties
        : Properties.filter((listing) => listing.type === filteredType);

        return (
          <>
            <div className="mt-4 space-y-4 px-4 sm:px-6 lg:px-8">
              {filteredListings.map((listing, index) => (
                <div
                  key={index}
                  className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row"
                >
                  <div className="w-full md:w-1/2">
                    <ImageSlider images={listing.images || ["/default-image.jpg"]} />
                  </div>
                  <div className="w-full md:w-1/2 p-4 flex flex-col justify-between">
                    <div>
                      <h2
                        className="text-xl font-semibold text-gray-800 cursor-pointer hover:underline"
                        onClick={() => navigate(`/properties/${listing.id}`)}
                      >
                        {listing.type}
                      </h2>
                      <p className="text-gray-600 mt-2 text-sm">
                        {listing.description}
                      </p>
                      <span className="text-[#9D9D9D]">{listing.price} JOD / mth</span>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-800 font-semibold">
                        {listing.location}
                         
                      </p>
                     
                      <button
                        onClick={() => navigate(`/booking/${listing.id}`)}
                        className="mt-4 bg-[#0C2BA1] hover:bg-[#9D9D9D] text-white py-2 px-4 rounded-lg w-full md:w-auto"
                      >
                        Quick Quote
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      } 

  return (
    <>
      <div className="p-20 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            Office Space for Rent in Jordan
          </h1>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 cursor-pointer border px-4 py-2 rounded-full text-[#0C2BA1] border-[#0C2BA1] shadow-sm hover:shadow-md">
              <FaListUl className="text-[#0C2BA1]" /> List
            </button>
            <button
              onClick={() => navigate("/map")}
              className="flex cursor-pointer items-center gap-1 border px-4 py-2 rounded-full text-gray-700 shadow-sm hover:shadow-md"
            >
              <IoLocationOutline className="text-gray-500" /> Map
            </button>
          </div>
        </div>
        <div className="mt-3">
          <WorkspaceFilter onFilterChange={setFilter} />
        </div>
        <ProList filteredType={filter} />
      </div>
      <Footer />
    </>
  );
};

export default PropertyListings;

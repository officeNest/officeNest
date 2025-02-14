import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOffices } from "../features/PropertyListingsSlice"; 
import { FaListUl, FaChevronDown } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const workspaceOptions = [
  { name: "All Workspaces", description: "Show all available workspaces" },
  { name: "Serviced Offices", description: "Dedicated office space for teams" },
  { name: "Coworking Spaces", description: "Shared workspace with flexible seating" },
  { name: "Commercial Spaces", description: "Business address with remote services" },
];

function ImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
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
    const navigate= useNavigate();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.offices.offices); // جلب البيانات من Redux
  const [filter, setFilter] = useState("All Workspaces");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://officenest-380c1-default-rtdb.firebaseio.com/properties.json");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        dispatch(setOffices(Object.values(data))); // تحديث Redux بالبيانات
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
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
          {selectedOption.name} <FaChevronDown className="ml-2 text-[#0C2BA1]" />
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
                  selectedOption.name === option.name ? "text-green-600 font-semibold" : "text-gray-800"
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
      filteredType === "All Workspaces" ? products : products.filter((listing) => listing.type === filteredType);

    return (
      <>
        <div className="mt-4 space-y-4">
          {filteredListings.map((listing, index) => (
            <div
              key={index}
              className="max-w-250 h-70 mx-auto bg-white rounded-lg shadow-lg overflow-hidden flex"
            >
              <ImageSlider images={listing.images || ["/default-image.jpg"]} />
              <div className="w-1/2 p-6 flex flex-col justify-between">
                <div>
                  <h2
                    onClick={() => {
                      navigate(`/offices/${listing.id}`);
                    }}
                    className="text-xl font-semibold text-gray-800"
                  >
                    {listing.location}
                  </h2>
                  <p className="text-gray-600 mt-2 text-sm">
                    {listing.description}
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-gray-800 font-semibold">
                    {listing.type}:{" "}
                    <span className="text-[#9D9D9D]">
                      JOD{listing.price} / mth
                    </span>
                  </p>
                  <button
                    onClick={() => {
                      navigate(`/booking/${listing.id}`);
                      console.error("Listing ID is undefined");
                    }}
                    className="mt-6 bg-[#0C2BA1] hover:bg-[#9D9D9D] text-white py-2 px-4 rounded-lg w-50 ml-5"
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
    <div className="p-16 border-b">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Office Space for Rent in Amman</h1>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 border px-4 py-2 rounded-full text-[#0C2BA1] border-[#0C2BA1] shadow-sm hover:shadow-md">
            <FaListUl className="text-[#0C2BA1]" /> List
          </button>
          <button className="flex items-center gap-1 border px-4 py-2 rounded-full text-gray-700 shadow-sm hover:shadow-md">
            <IoLocationOutline className="text-gray-500" /> Map
          </button>
        </div>
      </div>
      <div className="mt-3">
        <WorkspaceFilter onFilterChange={setFilter} />
      </div>
      <ProList filteredType={filter} />
    </div>
    <Footer/>
    </>
  );
};

export default PropertyListings;

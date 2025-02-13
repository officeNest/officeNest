import { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import FAQ from "../components/FAQ"; 
import Footer from "../components/Footer"

const PropertiesDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const listing = location.state?.listing;

  if (!listing) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [popupImage, setPopupImage] = useState("");

  const openPopup = (image) => {
    setPopupImage(image);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    setPopupImage("");
  };

  return (
    <>
    <div className="bg-white-100 py-8 px-4">
      <div className="container mx-auto">
        {/* buttons*/}
        <div className="flex items-center justify-between w-full p-4 mt-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 border rounded-full text-[#0C2BA1] hover:bg-gray-200"
          >
            <AiOutlineArrowLeft size={18} /> Back
          </button>
        </div>

        {/* images*/}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {listing.images.map((image, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-md">
              <img
                src={image}
                alt="Property"
                className="w-full h-48 object-cover transform transition-all duration-300 hover:scale-110 hover:translate-x-2 hover:translate-y-2 cursor-pointer"
                onClick={() => openPopup(image)}
              />
            </div>
          ))}
        </div>

        {/* Popup*/}
        {isOpen && (
          <div
            className="fixed inset-0 flex justify-center items-center z-50"
            onClick={closePopup}
          >
            <div className="relative">
              <img
                src={popupImage}
                alt="Image"
                className="w-[90vw] h-[90vh] object-contain"
              />
              <button
                onClick={closePopup}
                className="absolute top-5 right-4 text-[#0C2BA1] text-3xl pb-2 bg-[#DEDEDE] rounded-full w-15 h-10"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        {/* Description and Booking*/}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Description Box */}
          <div className="col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{listing.type}</h2>
              <p className="text-gray-600 mb-4">{listing.description}</p>
              <p className="text-gray-600 mb-4">{listing.description2}</p>
              <p className="text-gray-600 mb-4">{listing.capacity} ppl</p>
              <h2 className="text-xl font-semibold text-gray-800">{listing.location}</h2>
              <h2 className="text-l font-semibold text-[#0C2BA1]">{listing.status}</h2>
            </div>
          </div>

          {/* Booking Box */}
          <div className="col-span-1">
            <div className="border rounded-lg p-6 shadow-lg mb-8">
              <button
                onClick={() => navigate("BookingPage")}
                className="w-full bg-[#0C2BA1] hover:bg-[#9D9D9D] text-white py-2 px-4 rounded-lg"
              >
                Quick Quote
              </button>
              <p className="text-sm text-gray-500 mt-3">
                More sizes and configurations can be purchased from this workspace.
              </p>
            </div>
          </div>
        </div>

        {/* 5 reasons to choose this workspace */}
        <div className="max-w-4xl mx-auto p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            5 reasons to choose this workspace
          </h2>
          <hr className="border-gray-300 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800">
            <div className="flex items-center">
              <span className="text-[#0C2BA1] text-xl">✔</span>
              <span className="ml-4 text-lg">Private Workspace</span>
            </div>
            <div className="flex items-center">
              <span className="text-[#0C2BA1] text-xl">✔</span>
              <span className="ml-4 text-lg">Services included</span>
            </div>
            <div className="flex items-center">
              <span className="text-[#0C2BA1] text-xl">✔</span>
              <span className="ml-4 text-lg">Flexible term</span>
            </div>
            <div className="flex items-center">
              <span className="text-[#0C2BA1] text-xl">✔</span>
              <span className="ml-4 text-lg">Fixed cost</span>
            </div>
            <div className="flex items-center">
              <span className="text-[#0C2BA1] text-xl">✔</span>
              <span className="ml-4 text-lg">Fast move in</span>
            </div>
          </div>
        </div>
      </div>
       {/* FAQ Section */}
       <FAQ />
    </div>
    <Footer/>
    </>
  );
};

export default PropertiesDetails;

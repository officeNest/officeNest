import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, get } from "firebase/database";
import { db } from "../firebase";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import FAQ from "../components/FAQ"; 
import Footer from "../components/Footer"
import VideoSection from "../components/VideoSection";
import Reviews from "../components/Reviews";

const PropertiesDetails = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [popupImage, setPopupImage] = useState("");

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const propertyRef = ref(db, `properties/${propertyId}`);
        const snapshot = await get(propertyRef);

        if (snapshot.exists()) {
          setProperty(snapshot.val());
        } else {
          console.error("Property not found.");
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  const openPopup = (image) => {
    setPopupImage(image);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    setPopupImage("");
  };

  if (!property) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  return (
    <>
      <div className="bg-white-100 py-8 px-4">
        <div className="container mx-auto">
          {/* Back Button */}
          <div className="flex items-center justify-between w-full p-4 mt-10">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 border rounded-full text-[#0C2BA1] hover:bg-gray-200"
            >
              <AiOutlineArrowLeft size={18} /> Back
            </button>
          </div>

          {/* Property Images */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            {property.images.map((image, index) => (
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

          {/* Image Popup */}
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

          {/* Property Description and Booking */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            {/* Description Box */}
            <div className="col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {property.type}
                </h2>
                <p className="text-gray-600 mb-4">{property.description}</p>
                <p className="text-gray-600 mb-4">{property.description2}</p>
                <p className="text-gray-600 mb-4">{property.capacity} ppl</p>
                <h2 className="text-xl font-semibold text-gray-800">
                  {property.location}
                </h2>
                <h2 className="text-l font-semibold text-[#0C2BA1]">
                  {property.status}
                </h2>
              </div>
            </div>

            {/* Booking Box */}
            <div className="col-span-1">
              <div className="border rounded-lg p-6 shadow-lg mb-8">
                <button
                  onClick={() => navigate(`/booking/${propertyId}`)}
                  className="w-full bg-[#0C2BA1] hover:bg-[#9D9D9D] text-white py-2 px-4 rounded-lg"
                >
                  Quick Quote
                </button>
                <p className="text-sm text-gray-500 mt-3">
                  More sizes and configurations can be purchased from this
                  workspace.
                </p>
              </div>
            </div>
          </div>

          {/* 5 Reasons to Choose This Workspace */}
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
       
    <VideoSection/>
     
    <Reviews officeId={propertyId}/>
    
    <Footer/>
    </>
  );
};

export default PropertiesDetails;

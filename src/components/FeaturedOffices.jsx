import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FeaturedOffices = () => {
  const [offices, setOffices] = useState([]);

  useEffect(() => {
    // Fetch data from Firebase Realtime Database
    const fetchOffices = async () => {
      try {
        const response = await axios.get(
          "https://officenest-380c1-default-rtdb.firebaseio.com/properties.json"
        );
        if (response.data) {
          // Convert Firebase object into an array
          const data = Object.entries(response.data).map(([id, details]) => ({
            id,
            ...details,
          }));
          setOffices(data);
        }
      } catch (error) {
        console.error("Error fetching offices:", error);
      }
    };

    fetchOffices();
  }, []);

  return (
    <div className="max-w-6xl mx-auto my-10">
      <h2 className="text-3xl font-bold text-center mt-15 mb-6">Featured Offices</h2>
      
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={-50}
        slidesPerView={1} // Mobile view (1 card)
        breakpoints={{
          640: { slidesPerView: 2 }, // Tablet view (2 cards)
          1024: { slidesPerView: 3 }, // Desktop view (3 cards)
        }}
        navigation
        pagination={{ clickable: true }}
        className="pb-10"
      >
        {offices.slice(0, 6).map((office) => (
          <SwiperSlide key={office.id} className="pl-15 pr-15">
            <div className="bg-white mb-10 rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105">
              <img
                src={office.images[0]}
                alt={office.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{office.type}</h3>
                <p className="text-gray-600">{office.location}</p>
                <p className="text-lg font-bold text-[#0C2BA1]">{office.price}JD/month</p>
                <button className="mt-4 w-full bg-[#0C2BA1] text-white px-4 py-2 rounded-lg hover:bg-[#00104B] transition">
                  Quick Now
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturedOffices;

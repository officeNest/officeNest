import React, { useEffect, useState } from 'react';
import { FaListUl } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import Footer from './Footer';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin
} from "@vis.gl/react-google-maps";

// Replace with your actual Firebase database URL
const firebaseURL = "https://officenest-380c1-default-rtdb.firebaseio.com/properties.json";



const PoiMarkers = ({ pois = [], navigate, listings = [] }) => {
  return (
    <>
      {pois.map((poi) => {
        // Find the listing where office.id matches poi.key
        const listing = listings.find((office) => office.id === poi.key);
        console.log(listings);
        return (
          <AdvancedMarker
            key={String(poi.key)} // Ensure key is a string
            position={poi.location}
            onClick={() => {
                navigate(`/properties/${listing.id}`); // Pass found listing
              }
            }
          >
            <Pin background="#0C2BA1" glyphColor="white" borderColor="white" />
          </AdvancedMarker>
        );
      })}
    </>
  );
};



function OfficeMap() {
  const navigate = useNavigate();
  const [offices, setOffices] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [listings, setListings] = useState([]);
    // Handle scroll effect
    useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 20);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await axios.get(firebaseURL);
        if (response.data) {
          const listingsArray = Object.keys(response.data).map((key) => ({
            id: key, // Assign Firebase key as ID
            ...response.data[key], // Spread the rest of the property data
          }));
          
          setListings(listingsArray);
          const officeList = Object.keys(response.data).map((key) => ({
            key,
            location: {
              lat: parseFloat(response.data[key].lat),
              lng: parseFloat(response.data[key].lng),
            },
          }));
          setOffices(officeList);
        } else {
          setOffices([]);
        }
      } catch (error) {
        console.error("Error fetching office locations:", error);
      }
    };

    fetchOffices();
  }, []);

  return (
    <>
      <div className={`fixed w-full top-16 z-50 transition-all duration-300 h-20 pl-20 pr-20 pt-5 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-white"
      }`}>
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Office Space for Rent in Jordan</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/offices')} className="flex cursor-pointer items-center gap-1 border px-4 py-2 rounded-full text-gray-700 shadow-sm hover:shadow-md">
              <FaListUl className="text-gray-500" /> List
            </button>
            <button className="flex items-center gap-1 border px-4 py-2 cursor-pointer rounded-full text-[#0C2BA1] border-[#0C2BA1] shadow-sm hover:shadow-md">
              <IoLocationOutline className="text-[#0C2BA1]" /> Map
            </button>
          </div>
        </div>
      </div>

      <APIProvider apiKey={'AIzaSyB1nfqddowoYixELNOmRLZhFUZ0knnzfXw'}>
        <Map
          style={{ width: "100%", height: "1000px" }}
          defaultZoom={13}
          defaultCenter={{ lat: 31.963158, lng: 35.930359 }}
          mapId="83120833d3c052c4"
        >
          {/* Pass navigate function */}
          <PoiMarkers pois={offices} navigate={navigate} listings={listings} />
        </Map>
      </APIProvider>
    </>
  );
}

export default OfficeMap;

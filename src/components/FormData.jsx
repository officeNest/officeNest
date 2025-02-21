import React, { useState } from "react";
import axios from "axios";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
export default function FormData() {
  <Nav />;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    size: "",
    capacity: "",
    status: "Available",
    price: "",
    images: [],
    video: null,
    approvment: true,
    description: "",
    ownerId: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.uid) {
      alert("You must be logged in to add a property!");
      return;
    }

    const firebaseUrl = `https://officenest-380c1-default-rtdb.firebaseio.com/properties.json`;

    const propertyData = {
      ...formData,
      images: formData.images.split(",").map((url) => url.trim()),
      ownerId: user.uid,
      lat: formData.latitude,
      lng: formData.longitude,
    };

    try {
      await axios.post(firebaseUrl, propertyData);
      alert("Property Added Successfully!");
      setFormData({
        name: "",
        type: "",
        location: "",
        size: "",
        capacity: "",
        status: "Available",
        price: "",
        images: [],
        video: null,
        approvment: false,
        description: "",
        ownerId: "",
        latitude: "",
        longitude: "",
      });
      navigate("/my");
    } catch (error) {
      console.error("Error adding property:", error);
      alert("Failed to add property.");
    }
  };

  return (
    <>
      <div className="relative flex flex-col justify-center min-h-screen overflow-hidden bg-gray-50 pt-20">
        <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl ring-2 ring-indigo-600 lg:max-w-2xl">
          <h1 className="text-3xl font-semibold text-center text-indigo-700 underline uppercase decoration-wavy">
            Add Property
          </h1>
          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="text-gray-700">Office Name</label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-2 mt-2 border-2 border-gray-500 rounded-md focus:border-indigo-600 focus:ring focus:ring-indigo-300"
                placeholder="Modern Co-Working Space in Downtown"
                onChange={handleChange}
                required
                value={formData.name}
              />
            </div>

            <div className="mb-2">
              <label className="text-gray-700">Office Type</label>
              <select
                name="type"
                className="w-full px-4 py-2 mt-2 border-2 border-gray-500 rounded-md focus:border-indigo-600 focus:ring focus:ring-indigo-300"
                onChange={handleChange}
                required
                value={formData.type}
              >
                <option value="">Select Type</option>
                <option value="Private Office">Private Office</option>
                <option value="Co-Working Space">Co-Working Space</option>
                <option value="Shared Office">Shared Office</option>
                <option value="Conference Room">Conference Room</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="text-gray-700">Location & Address</label>
              <input
                type="text"
                name="location"
                className="w-full px-4 py-2 mt-2 border-2 border-gray-500 rounded-md focus:border-indigo-600 focus:ring focus:ring-indigo-300"
                placeholder="123 Main Street, New York, NY"
                onChange={handleChange}
                required
                value={formData.location}
              />
            </div>

            <div className="mb-2">
              <label className="text-gray-700">Latitude</label>
              <input
                type="number"
                name="latitude"
                className="w-full px-4 py-2 mt-2 border-2 border-gray-500 rounded-md focus:border-indigo-600 focus:ring focus:ring-indigo-300"
                placeholder="Enter latitude"
                onChange={handleChange}
                required
                value={formData.latitude}
              />
            </div>

            <div className="mb-2">
              <label className="text-gray-700">Longitude</label>
              <input
                type="number"
                name="longitude"
                className="w-full px-4 py-2 mt-2 border-2 border-gray-500 rounded-md focus:border-indigo-600 focus:ring focus:ring-indigo-300"
                placeholder="Enter longitude"
                onChange={handleChange}
                required
                value={formData.longitude}
              />
            </div>

            <div className="mb-2">
              <label className="text-gray-700">Description</label>
              <textarea
                name="description"
                className="w-full px-4 py-2 mt-2 border-2 border-gray-500 rounded-md focus:border-indigo-600 focus:ring focus:ring-indigo-300"
                placeholder="Description"
                onChange={handleChange}
                required
                value={formData.description}
              />
            </div>

            <div className="mb-2">
              <label className="text-gray-700">Office Size (sq ft)</label>
              <input
                type="number"
                name="size"
                className="w-full px-4 py-2 mt-2 border-2 border-gray-500 rounded-md focus:border-indigo-600 focus:ring focus:ring-indigo-300"
                placeholder="500"
                onChange={handleChange}
                required
                value={formData.size}
              />
            </div>

            <div className="mb-2">
              <label className="text-gray-700">Capacity (People)</label>
              <input
                type="number"
                name="capacity"
                className="w-full px-4 py-2 mt-2 border-2 border-gray-500 rounded-md focus:border-indigo-600 focus:ring focus:ring-indigo-300"
                placeholder="Up to 10"
                onChange={handleChange}
                required
                value={formData.capacity}
              />
            </div>

            <div className="mb-2">
              <label className="text-gray-700">
                Price (Per Month/Day/Hour)
              </label>
              <input
                type="text"
                name="price"
                className="w-full px-4 py-2 mt-2 border-2 border-gray-500 rounded-md focus:border-indigo-600 focus:ring focus:ring-indigo-300"
                placeholder="$500/month"
                onChange={handleChange}
                required
                value={formData.price}
              />
            </div>

            <div className="mb-2">
              <label className="text-gray-700">
                Image URLs (comma separated)
              </label>
              <input
                type="text"
                name="images"
                className="w-full px-4 py-2 mt-2 border-2 border-gray-500 rounded-md focus:border-indigo-600 focus:ring focus:ring-indigo-300"
                placeholder="Enter image URLs separated by commas"
                onChange={handleChange}
                required
                value={formData.images}
              />
            </div>

            <div className="mb-2">
              <label className="text-gray-700">Upload Video</label>
              <input
                type="file"
                name="video"
                accept="video/*"
                className="w-full px-4 py-2 mt-2 border-2 border-gray-500 rounded-md focus:border-indigo-600 focus:ring focus:ring-indigo-300"
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <button
                type="submit"
                className="h-10 px-5 text-indigo-100 bg-indigo-700 rounded-lg w-full hover:bg-indigo-800 transition"
              >
                Add Office
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

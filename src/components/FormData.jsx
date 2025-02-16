import React, { useState } from "react";
import axios from "axios";
import Nav from "./Nav";

export default function FormData() {
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
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (name === "images") {
        setFormData({ ...formData, images: [...files] });
      } else {
        setFormData({ ...formData, video: files[0] });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!user || !user.uid) {
      alert("You must be logged in to add a property!");
      return;
    }
    
    const firebaseUrl = `https://officenest-380c1-default-rtdb.firebaseio.com/properties/${user.uid}.json`;
    
    const propertyData = {
      ...formData,
      images: formData.images.map((file) => file.name),
      video: formData.video ? formData.video.name : null,
      owner: {
        uid: user.uid,
        email: user.email,
        name: user.name || "Unknown Owner",
      },
    };
    
    try {
      const { data: existingData } = await axios.get(firebaseUrl);
      const updatedProperties = existingData ? [...existingData, propertyData] : [propertyData];
      await axios.put(firebaseUrl, updatedProperties);
      
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
      });
    } catch (error) {
      console.error("Error adding property:", error);
      alert("Failed to add property.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8 mt-15">
      <Nav/>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 py-6 px-8">
            <h1 className="text-2xl font-bold text-white text-center">
              Add New Property
            </h1>
          </div>

          {/* Form */}
          <form className="p-8 space-y-6" onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Office Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Modern Co-Working Space"
                    onChange={handleChange}
                    required
                    value={formData.name}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Office Type
                  </label>
                  <select
                    name="type"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location & Address
                </label>
                <input
                  type="text"
                  name="location"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="123 Main Street, New York, NY"
                  onChange={handleChange}
                  required
                  value={formData.location}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Describe your property..."
                  onChange={handleChange}
                  required
                  value={formData.description}
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-4 pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Property Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size (sq ft)
                  </label>
                  <input
                    type="number"
                    name="size"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="500"
                    onChange={handleChange}
                    required
                    value={formData.size}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="10"
                    onChange={handleChange}
                    required
                    value={formData.capacity}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    name="price"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="$500/month"
                    onChange={handleChange}
                    required
                    value={formData.price}
                  />
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div className="space-y-4 pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Media Files
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Images
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload images</span>
                          <input
                            type="file"
                            name="images"
                            className="sr-only"
                            multiple
                            accept="image/*"
                            onChange={handleChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Video
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload video</span>
                          <input
                            type="file"
                            name="video"
                            className="sr-only"
                            accept="video/*"
                            onChange={handleChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        MP4, WebM up to 50MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Add Property
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

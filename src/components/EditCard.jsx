import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    size: "",
    capacity: "",
    status: "Available",
    price: "",
    images: "",
    video: null,
    approvment: true,
    description: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(
        `https://officenest-380c1-default-rtdb.firebaseio.com/properties/${id}.json`
      );
      
      if (response.data) {
        setFormData({
          ...response.data,
          images: Array.isArray(response.data.images) 
            ? response.data.images.join(', ')
            : response.data.images
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching property:", error);
      alert("Failed to fetch property details.");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      ...formData,
      images: formData.images.split(',').map(url => url.trim()),
      lat: formData.latitude,
      lng: formData.longitude,
    };

    try {
      await axios.put(
        `https://officenest-380c1-default-rtdb.firebaseio.com/properties/${id}.json`,
        updatedData
      );
      alert("Property Updated Successfully!");
      navigate('/my');
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Failed to update property.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden bg-gray-50 pt-20">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl ring-2 ring-indigo-600 lg:max-w-2xl">
        <h1 className="text-3xl font-semibold text-center text-indigo-700 uppercase">
          Edit Property
        </h1>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="text-gray-700">Office Name</label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2 mt-2 border-2 border-gray-500 rounded-md focus:border-indigo-600 focus:ring focus:ring-indigo-300"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="text-gray-700">Office Type</label>
            <select
              name="type"
              className="w-full px-4 py-2 mt-2 border-2 border-gray-500 rounded-md focus:border-indigo-600 focus:ring focus:ring-indigo-300"
              value={formData.type}
              onChange={handleChange}
              required
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
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="text-gray-700">Latitude</label>
            <input
              type="number"
              name="latitude"
              className="w-full px-4 py-2 mt-2 border-2 border-gray-500 rounded-md focus:border-indigo-600 focus:ring focus:ring-indigo-300"
              value={formData.latitude}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="text-gray-700">Longitude</label>
            <input
              type="number"
              name="longitude"
              className="w-full px-4 py-2 mt-2 border-2 border-gray-500 rounded-md focus:border-indigo-600 focus:ring focus:ring-indigo-300"
              value={formData.longitude}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="text-gray-700">Description</label>
            <textarea
              name="description"
              className="w-full px-4 py-2 mt-2 border-2 border-gray-500 rounded-md focus:border-indigo-600 focus:ring focus:ring-indigo-300"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="text-gray-700">Office Size (sq ft)</label>
            <input
              type="number"
              name="size"
              className="w-full px-4 py-2 mt-2 border-2 border-gray-500 rounded-md focus:border-indigo-600 focus:ring focus:ring-indigo-300"
              value={formData.size}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="text-gray-700">Capacity (People)</label>
            <input
              type="number"
              name="capacity"
              className="w-full px-4 py-2 mt-2 border-2 border-gray-500 rounded-md focus:border-indigo-600 focus:ring focus:ring-indigo-300"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="text-gray-700">Price (Per Month/Day/Hour)</label>
            <input
              type="text"
              name="price"
              className="w-full px-4 py-2 mt-2 border-2 border-gray-500 rounded-md focus:border-indigo-600 focus:ring focus:ring-indigo-300"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="text-gray-700">Image URLs (comma separated)</label>
            <input
              type="text"
              name="images"
              className="w-full px-4 py-2 mt-2 border-2 border-gray-500 rounded-md focus:border-indigo-600 focus:ring focus:ring-indigo-300"
              value={formData.images}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="text-gray-700">Approval Status</label>
            <select
              name="approvment"
              className="w-full px-4 py-2 mt-2 border-2 border-gray-500 rounded-md focus:border-indigo-600 focus:ring focus:ring-indigo-300"
              value={formData.approvment}
              onChange={handleChange}
            >
              <option value={true}>Approved</option>
              <option value={false}>Not Approved</option>
            </select>
          </div>

          <div className="mb-6">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
            >
              Update Property
            </button>
          </div>

          <div className="mb-6">
            <button
              type="button"
              onClick={() => navigate('/my')}
              className="w-full px-4 py-2 text-indigo-600 bg-white border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCard;
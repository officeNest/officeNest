import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "./Nav";

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.uid) {
        console.error('No user found');
        return;
      }

      const response = await axios.get(
        'https://officenest-380c1-default-rtdb.firebaseio.com/properties.json'
      );

      if (response.data) {
        const propertiesArray = Object.entries(response.data)
          .map(([id, data]) => ({
            id,
            ...data
          }))
          .filter(property => property.ownerId === user.uid);
        
        setProperties(propertiesArray);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(
          `https://officenest-380c1-default-rtdb.firebaseio.com/properties/${propertyId}.json`
        );
        setProperties(properties.filter(property => property.id !== propertyId));
        alert('Property deleted successfully!');
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property.');
      }
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
        <div className="container mx-auto px-4 py-8">
          <Nav />
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800"></h1>
      
      {properties.length === 0 ? (
        <div className="text-center text-gray-600">
         
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Image Section */}
              <div className="relative h-48">
                {property.images && property.images.length > 0 && (
                  <img
                    src={property.images[0]}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                )}
                {property.approvment && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-sm">
                    Approved
                  </span>
                )}
              </div>

              {/* Content Section */}
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{property.name}</h2>
                
                <div className="space-y-2 text-gray-600">
                  <p className="flex justify-between">
                    <span className="font-semibold">Type:</span>
                    <span>{property.type}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold">Location:</span>
                    <span>{property.location}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold">Price:</span>
                    <span>{property.price}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold">Capacity:</span>
                    <span>{property.capacity} people</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold">Size:</span>
                    <span>{property.size} sq ft</span>
                  </p>
                </div>

                {/* Description */}
                <p className="mt-4 text-gray-600 line-clamp-2">{property.description}</p>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => window.location.href = `/edit/${property.id}`}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProperties;
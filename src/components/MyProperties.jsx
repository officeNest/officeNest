import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "./Nav"

export default function MyProperties() {
  const [properties, setProperties] = useState([]); // تأكد أن الحالة تبدأ كمصفوفة
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      const user = JSON.parse(localStorage.getItem("user")); // جلب بيانات المستخدم
      if (!user || !user.uid) {
        alert("You must be logged in to view properties!");
        return;
      }

      const firebaseUrl = `https://officenest-380c1-default-rtdb.firebaseio.com/properties/${user.uid}.json`;

      try {
        const { data } = await axios.get(firebaseUrl);
        
        // التأكد أن البيانات موجودة قبل استخدامها
        const propertiesArray = data ? Object.values(data) : [];
        setProperties(propertiesArray);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]); //  التعامل مع الخطأ وإعادة تعيين الحالة كمصفوفة فارغة
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <>
    <Nav />
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-semibold text-center text-indigo-700 underline mb-6">
        My Properties
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading properties...</p>
      ) : properties.length === 0 ? ( //  التأكد أن `properties` ليست undefined
        <p className="text-center text-gray-600">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {properties.map((property, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              {property.images && property.images.length > 0 && (
                <img
                  src={property.images[0]} 
                  alt={property.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-xl font-bold text-gray-800">{property.name}</h2>
              <p className="text-gray-600">{property.type}</p>
              <p className="text-indigo-600 font-semibold">{property.price}</p>
              <p className="text-gray-500 text-sm">Location: {property.location}</p>

             
              <div className="mt-4 p-2 border-t border-gray-200">
                <p className="text-gray-700 text-sm font-medium">Owner:</p>
                <p className="text-gray-600 text-sm">{property.owner?.name} ({property.owner?.email})</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}

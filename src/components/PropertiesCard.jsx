// PropertiesCard.js
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function PropertiesCard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://officenest-380c1-default-rtdb.firebaseio.com/properties.json")
      .then((response) => {
        const data = response.data;
        console.log(data)
        const propertiesArray = data
          ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
          : [];
        setProperties(propertiesArray);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching properties:", error);
        setLoading(false);
      });
  }, []);
    return (
      <div className="p-6">
        <h1 className="text-3xl font-semibold mb-4">Properties</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((office) => (
              <div key={office.id} className="p-6 rounded-lg shadow-lg bg-white">
                <img
                  src={office.images ? office.images[0] : "/default-image.jpg"}
                  alt={office.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h2 className="text-xl font-bold">{office.name}</h2>
                <p className="text-gray-600">Type: {office.type}</p>
                <p className="text-gray-600">Location: {office.location}</p>
                <p className="text-lg font-semibold text-blue-600">Price: {office.price}</p>
                <p className={`mt-2 font-medium ${office.status === "Available" ? "text-green-500" : "text-red-500"}`}>
                  {office.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
}

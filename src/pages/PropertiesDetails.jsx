
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const firebaseURL = "https://officenest-380c1-default-rtdb.firebaseio.com/properties.json";

const PropertiesDetails = () => {
  const { id } = useParams();
  const [office, setOffice] = useState(null);

  useEffect(() => {
    const fetchOfficeDetails = async () => {
      try {
        const response = await axios.get(firebaseURL);
        if (response.data && response.data[id]) {
          setOffice(response.data[id]);
        }
      } catch (error) {
        console.error("Error fetching office details:", error);
      }
    };

    fetchOfficeDetails();
  }, [id]);

  if (!office) return <p>Loading office details...</p>;

  return (
    <div className="pt-20">
      <h2>{office.name}</h2>
      <p>Location: {office.lat}, {office.lng}</p>
      <p>Price: {office.price} JOD</p>
      <p>Description: {office.description}</p>
    </div>
  );
};

export default PropertiesDetails;

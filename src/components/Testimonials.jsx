import { useEffect, useState } from "react";
import { db } from "../firebase"; 
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, "reviews");
        const q = query(reviewsRef, orderBy("timestamp", "desc"), limit(5));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No reviews found in Firestore.");
          setReviews([]);
        } else {
          const reviewsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          console.log("Fetched Reviews:", reviewsData);
          setReviews(reviewsData);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="py-10 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-6">Testimonials</h2>

        {/* Loading State */}
        {loading && <p className="text-center text-gray-500">Loading reviews...</p>}

        {/* Error State */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Display Reviews */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold">{review.userName}</h3>
                  <p className="text-gray-600 mt-2">{review.title}</p>
                  <p className="text-gray-500 mt-1">Rating: ⭐ {review.rating}</p>
                </div>
              ))
            ) : (
              <p className="text-center col-span-3">No reviews available.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Testimonials;
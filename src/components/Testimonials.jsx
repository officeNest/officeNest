import { useEffect, useState } from "react";
import { db } from "../firebase"; // Ensure this path is correct
import { ref, get } from "firebase/database"; // Import Realtime Database functions

function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Number of items to show per slide
  const itemsPerSlide = 3;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsRef = ref(db, "reviews"); // Reference to the 'reviews' node
        const snapshot = await get(reviewsRef); // Fetch data
        if (!snapshot.exists()) {
          console.log("No reviews found in Realtime Database.");
          setReviews([]);
        } else {
          const reviewsData = Object.entries(snapshot.val()).map(
            ([id, data]) => ({
              id,
              ...data,
            })
          );
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

  // Calculate total number of slides needed
  const totalSlides = Math.ceil(reviews.length / itemsPerSlide);

  const nextSlide = () => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (totalSlides <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  // Get current slide items
  const getCurrentSlideItems = () => {
    const startIdx = currentIndex * itemsPerSlide;
    return reviews.slice(startIdx, startIdx + itemsPerSlide);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Client Testimonials
          </h2>
          <div className="w-24 h-1 bg-[#0C2BA1] mx-auto"></div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-48">
            <div className="w-12 h-12 border-4 border-[#0C2BA1] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-md mx-auto max-w-2xl">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Multi-Item Slider */}
        {!loading && !error && reviews.length > 0 && (
          <div className="relative px-4 pb-12">
            {/* Slider Container */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                  // Get items for this slide
                  const startIdx = slideIndex * itemsPerSlide;
                  const slideItems = reviews.slice(
                    startIdx,
                    startIdx + itemsPerSlide
                  );

                  return (
                    <div
                      key={slideIndex}
                      className="flex-shrink-0 w-full flex flex-wrap gap-6"
                    >
                      {slideItems.map((review) => (
                        <div
                          key={review.id}
                          className="flex-1 min-w-64 bg-white p-6 rounded-xl shadow-lg border-t-4 border-[#0C2BA1]"
                        >
                          {/* Stars */}
                          <div className="flex space-x-1 mb-4 text-[#0C2BA1]">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-[#0C2BA1]"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>

                          {/* Content */}
                          {review.content && (
                            <p className="text-gray-700 mb-4 line-clamp-3 italic">
                              "{review.content}"
                            </p>
                          )}

                          {/* Divider */}
                          <div className="w-12 h-px bg-gray-200 my-4"></div>

                          {/* User Info */}
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {review.userName}
                            </h3>
                            {review.title && (
                              <p className="text-[#0C2BA1] text-sm font-medium mt-1">
                                {review.title}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Controls */}
            {totalSlides > 1 && (
              <>
                {/* Arrow Buttons */}
                <button
                  onClick={prevSlide}
                  className="absolute left-auto right-[110%] top-1/2 -translate-y-1/2 bg-white hover:bg-[#0C2BA1] hover:text-white p-3 rounded-full shadow-lg text-[#0C2BA1] focus:outline-none transition-colors duration-300 border border-[#0C2BA1]/20 z-10"
                  aria-label="Previous testimonials"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-auto left-[110%] top-1/2 -translate-y-1/2 bg-white hover:bg-[#0C2BA1] hover:text-white p-3 rounded-full shadow-lg text-[#0C2BA1] focus:outline-none transition-colors duration-300 border border-[#0C2BA1]/20 z-10"
                  aria-label="Next testimonials"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* Dots Indicator */}
                <div className="flex justify-center mt-8 space-x-3">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 border ${
                        currentIndex === index
                          ? "bg-[#0C2BA1] border-[#0C2BA1] scale-125"
                          : "bg-transparent border-[#0C2BA1]/50 hover:bg-[#0C2BA1]/20"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* No Reviews State */}
        {!loading && !error && reviews.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center border-t-4 border-[#0C2BA1] max-w-2xl mx-auto">
            <p className="text-gray-500">No reviews available at this time.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Testimonials;

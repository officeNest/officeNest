import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import Swal from 'sweetalert2';

function Reviews({ officeId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    title: '',
    description: '',
    images: [],
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetchReviews();
  }, [officeId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `https://officenest-380c1-default-rtdb.firebaseio.com/reviews.json`
      );
      const reviewsData = await response.json();

      if (reviewsData) {
        const reviewsArray = Object.keys(reviewsData)
          .map((key) => ({
            id: key,
            ...reviewsData[key],
          }))
          .filter((review) => review.officeId === officeId);

        setReviews(reviewsArray);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value });
  };

  const handleRatingChange = (rating) => {
    setReviewData({ ...reviewData, rating });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setReviewData({ ...reviewData, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.uid) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'You must be logged in to add a review!',
        icon: 'warning',
        confirmButtonColor: '#0C2BA1'
      });
      return;
    }else if(user.flage == false) {
      alert("You have to book the office before write the review!");
      return;
    }

    console.log("useeeeeeeeeeeeeeeer       "+user.flage)

    const reviewPayload = {
      ...reviewData,
      officeId,
      userId: user.uid,
      userName: user.name || 'Anonymous',
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch(
        `https://officenest-380c1-default-rtdb.firebaseio.com/reviews.json`,
        {
          method: 'POST',
          body: JSON.stringify(reviewPayload),
        }
      );
      
      Swal.fire({
        title: 'Review Submitted!',
        text: 'Thank you for your feedback.',
        icon: 'success',
        confirmButtonColor: '#0C2BA1'
      });

      closeModal();
      fetchReviews();
    } catch (error) {
      console.error('Error adding review:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add review. Please try again.',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  };

  const StarRating = ({ rating, size = 5, interactive = false, onRate }) => (
    <div className="flex items-center gap-1">
      {[...Array(size)].map((_, i) => (
        <Star
          key={i}
          size={24}
          className={`${
            i < rating
              ? 'fill-[#0C2BA1] text-[#0C2BA1]'
              : 'fill-gray-200 text-gray-200'
          } ${interactive ? 'cursor-pointer transition-colors hover:text-[#0C2BA1]' : ''}`}
          onClick={() => interactive && onRate(i + 1)}
        />
      ))}
    </div>
  );

  return (
    <div className="bg-gray-50 py-12">
      <div className="mx-auto max-w-5xl px-4">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-8 md:flex-row md:items-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Reviews</h2>
              <div className="flex items-center gap-3">
                <StarRating rating={4} />
                <span className="text-lg font-medium text-gray-600">
                  4.65 out of 5
                </span>
              </div>
            </div>
            <button
              onClick={openModal}
              className="rounded-lg bg-[#0C2BA1] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#0C2BA1]/90 hover:shadow-lg"
            >
              Write a review
            </button>
          </div>

          <div className="mt-8 space-y-8">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:gap-8">
                    <div className="md:w-48">
                      <div className="mb-2">
                        <StarRating rating={review.rating} />
                      </div>
                      <h3 className="font-medium text-gray-900">
                        {review.userName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(review.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium text-gray-900">
                        {review.title}
                      </h4>
                      <p className="text-gray-600">{review.description}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">
                <p className="text-gray-500">No reviews yet. Be the first to add one!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
              <button
                onClick={closeModal}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Rating
                </label>
                <StarRating
                  rating={reviewData.rating}
                  interactive
                  onRate={handleRatingChange}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={reviewData.title}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-200 p-3 focus:border-[#0C2BA1] focus:outline-none focus:ring-1 focus:ring-[#0C2BA1]"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Review
                </label>
                <textarea
                  name="description"
                  value={reviewData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full rounded-lg border border-gray-200 p-3 focus:border-[#0C2BA1] focus:outline-none focus:ring-1 focus:ring-[#0C2BA1]"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Photos (Optional)
                </label>
                <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    multiple
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer text-sm text-gray-500"
                  >
                    <span className="text-[#0C2BA1]">Click to upload</span> or drag
                    and drop
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#0C2BA1] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#0C2BA1]/90"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reviews;
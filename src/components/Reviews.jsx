import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      const response = await axios.get(
        `https://officenest-380c1-default-rtdb.firebaseio.com/reviews.json`
      );
      const reviewsData = response.data;

      if (reviewsData) {
        // Convert the object of reviews into an array and filter by officeId
        const reviewsArray = Object.keys(reviewsData)
          .map((key) => ({
            id: key,
            ...reviewsData[key],
          }))
          .filter((review) => review.officeId === officeId); // Filter reviews by officeId

        setReviews(reviewsArray);
      } else {
        setReviews([]); // No reviews found
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
      alert('You must be logged in to add a review!');
      return;
    }

    const reviewPayload = {
      ...reviewData,
      officeId,
      userId: user.uid,
      userName: user.name || 'Anonymous',
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post(
        `https://officenest-380c1-default-rtdb.firebaseio.com/reviews.json`,
        reviewPayload
      );
      alert('Review added successfully!');
      closeModal();
      fetchReviews(); // Fetch reviews again to update the list
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Failed to add review.');
    }
  };

  return (
    <>
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Reviews</h2>
            <div className="mt-2 flex items-center gap-2 sm:mt-0">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-4 w-4 text-yellow-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">(4.6)</p>
              <a href="#" className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline dark:text-white">
                645 Reviews
              </a>
            </div>
          </div>

          <div className="my-6 gap-8 sm:flex sm:items-start md:my-8">
            <div className="shrink-0 space-y-4">
              <p className="text-2xl font-semibold leading-none text-gray-900 dark:text-white">4.65 out of 5</p>
              <button
                type="button"
                onClick={openModal}
                className="mb-2 me-2 rounded-lg bg-[#0C2BA1] cursor-pointer px-10 py-2.5 text-sm font-medium text-white hover:bg-white hover:text-black focus:outline-none hover:ring-2 focus:ring-red dark:bg-red dark:hover:bg-red dark:focus:ring-primary-800"
              >
                Write a review
              </button>
            </div>

            <div className="mt-6 min-w-0 flex-1 space-y-3 sm:mt-0">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="gap-3 py-6 sm:flex sm:items-start">
                    <div className="shrink-0 space-y-2 sm:w-48 md:w-72">
                      <div className="flex items-center gap-0.5">
                        {[...Array(review.rating)].map((_, i) => (
                          <svg
                            key={i}
                            className="h-4 w-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                          </svg>
                        ))}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-base font-semibold text-gray-900 dark:text-white">{review.userName}</p>
                        <p className="text-sm font-normal text-gray-500 dark:text-gray-400">{new Date(review.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mt-4 min-w-0 flex-1 space-y-4 sm:mt-0">
                      <p className="text-base font-normal text-gray-500 dark:text-gray-400">{review.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No reviews yet. Be the first to add one!</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div id="review-modal" tabIndex="-1" aria-hidden={!isModalOpen} className="fixed flex left-0 bg-white/50 backdrop-blur-[10px] shadow-lg right-0 top-0 z-50 max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0 antialiased">
          <div className="relative max-h-full w-full max-w-2xl p-4">
            <div className="relative p-5 rounded-lg bg-white shadow dark:bg-gray-800">
              <div className="flex items-center justify-between rounded-t border-b border-gray-200 p-4 dark:border-gray-700 md:p-5">
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Add a review For:</h3>
                  <a href="#" className="font-medium text-primary-700 hover:underline dark:text-primary-500">Office Name</a>
                </div>
                <button onClick={closeModal} type="button" className="absolute right-5 top-5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white">
                  <svg className="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 md:p-5">
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-6 w-6 cursor-pointer ${i < reviewData.rating ? 'text-yellow-300' : 'text-gray-300 dark:text-gray-500'}`}
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                          onClick={() => handleRatingChange(i + 1)}
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                      ))}
                      <span className="ms-2 text-lg font-bold text-gray-900 dark:text-white">{reviewData.rating}.0 out of 5</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Review title</label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={reviewData.title}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Review description</label>
                    <textarea
                      id="description"
                      name="description"
                      rows="6"
                      value={reviewData.description}
                      onChange={handleInputChange}
                      className="mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <p className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Add real photos of the product to help other customers <span className="text-gray-500 dark:text-gray-400">(Optional)</span></p>
                    <div className="flex w-full items-center justify-center">
                      <label htmlFor="dropzone-file" className="dark:hover:bg-bray-800 flex h-52 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                          <svg className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} multiple />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 dark:border-gray-700 md:pt-5">
                  <button type="submit" className="me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">Add review</button>
                  <button type="button" onClick={closeModal} className="me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Reviews;
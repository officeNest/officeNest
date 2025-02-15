import React from 'react';
import { FaClock, FaBuilding, FaGlobe, FaShieldAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function TrustSection() {
  return (
    <>
      <div className="h-120 bg-[#EFEFEF] rounded-[50px] ml-20 mr-20 dark:bg-gray-800 mb-20">
        <div className="items-center max-w-screen-xl px-4 py-8 mx-auto lg:grid lg:grid-cols-4 lg:gap-16 xl:gap-24 lg:py-24 lg:px-6">
        <div className="col-span-2 mb-8">
            <p className="text-lg font-medium text-[#0C2BA1] dark:text-[#0C2BA1]">Trusted by Businesses</p>
            <h2 className="mt-3 mb-4 text-3xl font-extrabold tracking-tight text-gray-900 md:text-3xl dark:text-white">
              Powering thousands of office rentals worldwide
            </h2>
            <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
              Our secure and efficient platform ensures businesses find the perfect office space with ease and confidence.
            </p>
            <div className="pt-6 mt-6 space-y-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <Link to="/offices" className="inline-flex items-center text-base font-medium text-[#0C2BA1] hover:text-black dark:text-[#0C2BA1] dark:hover:text-purple-700">
                  Explore Our Spaces
                  <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </Link>
              </div>
              <div>
                <Link href="/contact" className="inline-flex items-center text-base font-medium text-[#0C2BA1] hover:text-black dark:text-[#0C2BA1] dark:hover:text-purple-700">
                  Contact Us for More Details
                  <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-span-2 space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0">
            <div>
              <FaClock className="w-5 h-5 mb-2 text-[#0C2BA1] md:w-8 md:h-8 dark:text-[#0C2BA1]" />
              <h3 className="mb-2 text-2xl font-bold dark:text-white">24/7 Availability</h3>
              <p className="font-light text-gray-500 dark:text-gray-400">Book and manage office spaces anytime, anywhere.</p>
            </div>
            <div>
              <FaBuilding className="w-5 h-5 mb-2 text-[#0C2BA1] md:w-8 md:h-8 dark:text-[#0C2BA1]" />
              <h3 className="mb-2 text-2xl font-bold dark:text-white">5000+ Offices Listed</h3>
              <p className="font-light text-gray-500 dark:text-gray-400">Flexible workspaces in top locations.</p>
            </div>
            <div>
              <FaGlobe className="w-5 h-5 mb-2 text-[#0C2BA1] md:w-8 md:h-8 dark:text-[#0C2BA1]" />
              <h3 className="mb-2 text-2xl font-bold dark:text-white">Global Presence</h3>
              <p className="font-light text-gray-500 dark:text-gray-400">Operating in over 50 countries worldwide.</p>
            </div>
            <div>
              <FaShieldAlt className="w-5 h-5 mb-2 text-[#0C2BA1] md:w-8 md:h-8 dark:text-[#0C2BA1]" />
              <h3 className="mb-2 text-2xl font-bold dark:text-white">Secure Transactions</h3>
              <p className="font-light text-gray-500 dark:text-gray-400">Ensuring safety with encrypted payments.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TrustSection;

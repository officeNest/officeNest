import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../assets/logo2.png"

function Footer() {
  return (
    <>
    <footer className=" shadow-sm bg-[#00104B] ">
    <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
            <Link to="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                <img src={logo} className="h-10" alt="Flowbite Logo" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">Flexora</span>
            </Link>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 text-gray-400">
                <li>
                    <Link to="/" className="hover:underline me-4 md:me-6">Home</Link>
                </li>
                <li>
                    <Link to="/" className="hover:underline me-4 md:me-6">About</Link>
                </li>
                <li>
                    <Link to="/" className="hover:underline me-4 md:me-6">Contact</Link>
                </li>
                <li>
                    <Link to="/signup" className="hover:underline">Offices</Link>
                </li>
            </ul>
        </div>
        <hr className="my-6  sm:mx-auto border-gray-700" />
        <span className="block text-sm  sm:text-center text-gray-400">© 2025 <Link href="#" className="hover:underline">copyrite</Link>. All Rights Reserved.</span>
    </div>
</footer>
    </>
  )
}

export default Footer
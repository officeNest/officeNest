import React from 'react';
import { Link, useLocation, useNavigate,NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useSelector,useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function Navbar() {
    const dispatch =useDispatch();
    const user= useSelector((state)=> state.auth.user);
    console.log(user);

    const navigate = useNavigate();
    const location = useLocation(); // Get current route

    // Function to determine active link styles
    const getLinkClass = (path) => {
        return location.pathname === path
            ? "text-[#0C2BA1] font-semibold" // Active link color
            : "text-gray-900 hover:text-[#0C2BA1]"; // Default color
    };

    return (
        <nav className="bg-white border-gray-200 drop-shadow-md dark:bg-gray-900 fixed top-0 left-0 w-full z-50">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src={logo} className="h-15 ml-[-30px]" alt="Flexora Logo" />
                    <span className="self-center text-2xl ml-[-10px] font-semibold whitespace-nowrap dark:text-white">Flexora</span>
                </Link>
                
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
                        <li>
                            <Link to="/" className={`block py-2 px-3 rounded-sm md:p-0 ${getLinkClass("/")}`}>Home</Link>
                        </li>
                        <li>
                            <Link to="/offices" className={`block py-2 px-3 rounded-sm md:p-0 ${getLinkClass("/offices")}`}>Explore Offices</Link>
                        </li>
                        <li>
                            <Link to="/about" className={`block py-2 px-3 rounded-sm md:p-0 ${getLinkClass("/about")}`}>About Us</Link>
                        </li>
                        <li>
                            <Link to="/contact" className={`block py-2 px-3 rounded-sm md:p-0 ${getLinkClass("/contact")}`}>Contact Us</Link>
                        </li>
                    </ul>
                </div>

                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                {user? (
                     <div className="userNav">
                     <img src={user.image} alt="User Avatar" />
                     <span>{user.name}</span>
                     <Menu as="div" className="relative inline-block text-left">
                       <div>
                         <MenuButton id="menuBtn" className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-0">
                           <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                         </MenuButton>
                       </div>
           
                       <MenuItems
                         id="menuItems"
                         transition
                         className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-black/5 transition focus:outline-none data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-500 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                       >
                         <div className="py-1">
                           <MenuItem>
                             <NavLink to="/user-profile" className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-none">
                               Profile Settings
                             </NavLink>
                           </MenuItem>
                           { user.role !== "owner" ? (
                           <MenuItem>
                             <NavLink to="/ownersignup" className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                               Join As Owner
                             </NavLink>
                           </MenuItem>
                    ) :(
                        <MenuItem>
                        <NavLink to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                          Your Dashboard
                        </NavLink>
                         </MenuItem>
                    )}
                           <NavLink to="/signup">
                             <MenuItem>
                               <button onClick={() => dispatch(logout())} type="submit" className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                                 Logout
                               </button>
                             </MenuItem>
                           </NavLink>
                         </div>
                       </MenuItems>
                     </Menu>
                   </div>
                ):(
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <button
                        onClick={() => navigate('/signup')}
                        type="button"
                        className="text-white bg-[#0C2BA1] hover:bg-[#CCCCCC] hover:text-black cursor-pointer focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
                    >
                        Sign Up
                    </button>
                </div>
                )}
                </div>

            </div>
        </nav>
    );
}

export default Navbar;
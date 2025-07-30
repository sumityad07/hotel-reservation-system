// src/components/navbar/Navbar.jsx

import React, { useState, useEffect } from 'react';
import Button from '../components/Login _button/FormInput';
import logo from '../assets/logo.png';
import Searchbar from '../components/searchbar/Searchbar';
import profile from '../assets/profile.png';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useHotelStore from '../store/hotelStore'; // Corrected import

const Navbar = () => {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuthStore();
    const [search, setSearch] = useState(""); // Your search query state

    const { getAllHotels, hotels } = useHotelStore(); // Get all hotels

    useEffect(() => {
        getAllHotels();
    }, [getAllHotels]);

    // This `searchedHotel` is for dynamic display in the Navbar (e.g., dropdown suggestions)
    // It's NOT the data you'll pass to the /searchedHotel page.
    const searchedHotel = hotels?.filter(h =>
      h.location.toLowerCase().includes(search.toLowerCase())
    );

  

   
    const handlechange = (e) => {
        e.preventDefault(); // Prevent default form submission if wrapped in a form
        if (search.trim()) { // Only navigate if there's actual text
            navigate(`/searchedHotel?query=${encodeURIComponent(search.trim())}`); // <--- Pass query here
        }
    };

    const handleLogoutClick = () => { logout(navigate); };

    return (
        <>
            {/* mobile view */}
            <div className='block md:hidden w-full m-2 p-1 flex flex-col justify-center'>
                <div className="upper_section flex justify-between items-center">
                    <Link to ="/" className='text-4xl font-bold text-[#FF7A30]'>EasyStay</Link >
                    <div className='flex gap-2 items-center'>
                        <img className='w-32 h-auto' src={logo} alt="Company Logo" />
                        {isLoggedIn?(
                            <img onClick={()=>navigate('/profile')} className='w-12 h-auto' src={profile} alt="Profile" />
                        ):
                        <img onClick={() => navigate('/login')} className='w-12 h-auto' src={profile} alt="Login" />
                        }
                    </div>
                </div>
                {/* Ensure form has onSubmit */}
                <form onSubmit={handlechange} className="searchBar flex items-center justify-center ">
                    <Searchbar data={searchedHotel} // This 'data' is still for Navbar's internal display (e.g., dropdown)
                               value={search}
                               onChange={(e)=>setSearch(e.target.value)}
                    />
                </form>
            </div>

            {/* desktop view*/}
            <div className="hidden md:block mx-20 h-24 md:flex justify-between items-center ">
                <div className="left_Section flex justify-center items-center gap-4">
                    <img src={logo} alt="Company Logo" />
                    <Link to ="/" className='text-4xl font-bold text-[#FF7A30]'>EasyStay</Link >
                </div>
                <form onSubmit={handlechange} className="middle_section"> {/* Ensure onSubmit is here */}
                    <Searchbar data={searchedHotel} // Still for internal display if needed
                               value={search}
                               onChange={(e)=>setSearch(e.target.value)}
                    />
                </form>
                <div className="right_section flex gap-4 justify-center items-center">
                    {isLoggedIn ? (
                        <>
                            <Link to="/profile">
                                <Button name="Profile" />
                            </Link>
                            <Button onClick={handleLogoutClick} name="Logout" />
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button name="Login" />
                            </Link>
                            <Link to="/signup">
                                <Button name="Signup" />
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default Navbar;
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useAuthStore from '../store/authStore';
import SignupBtn from '../components/signup/SignupBtn';
import Input_Btn from '../components/Login _button/Input_Btn';
import signupbtn from '../assets/signupLogo.png';
import signupbtn_full from '../assets/signbtn_full.png';


const SignupPage = () => {
  const navigate = useNavigate();

  // Select state and actions from the store
  const {
    email,
    password,
    error,
    successMessage,
    loading,
    setEmail,
    setPassword,
    signup, 
    resetForm 
  } = useAuthStore(); // Use the store hook


  // Call resetForm when component mounts/unmounts to clear state
  useEffect(() => {
    return () => {
      resetForm(); // Reset form state when component unmounts
    };
  }, [resetForm]);


  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    // Call the signup action from the store, passing navigate
    await signup(navigate);
  };

  console.log("SignupPage rendered with email:", email, "and password:", password);
  
  return (
    <>
     
      {/* Mobile view of the SignupPage */}
      <div className='block sm:hidden flex flex-col items-center justify-center h-screen gap-4'>
        <h1 className='text-3xl font-bold'>Join for Seamless travel</h1>
        <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center gap-4'>
          {/* Email input */}
          <SignupBtn
            name="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* Password input */}
          <SignupBtn
            name="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Removed: Confirm Password input */}
          {/* Signup button */}
          <div className='flex flex-col items-center justify-center text-center  gap-4'>
            <Input_Btn type="submit" disabled={loading} text={loading ? "Signing Up..." : "Sign Up"} name="Signup" />
            <Link to ="/login">
            <p className=''>alreday user please login --{'>'}</p>
            </Link>
          </div>
        </form>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
        <div>
          <img src={signupbtn} alt="Signup Visual" />
        </div>
      </div>

      {/* Desktop view of the SignupPage */}
      <div className='hidden md:block md:flex px-20 py-20 md:justify-evenly'>
        <div className="left_side flex flex-col justify-center items-start gap-8">
          {/* Heading part */}
          <div className='flex flex-col gap-4'>
            <h1 className='text-4xl font-bold'>Join for Seamless Travel.</h1>
            <p className='font-thin text-lg'>Sign up to explore the world with us.</p>
          </div>
          {/* Input part wrapped in a form */}
          <form onSubmit={handleSubmit} className='flex flex-col gap-4 justify-center'>
            {/* Email input */}
            <SignupBtn
              name="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* Password input */}
            <SignupBtn
              name="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Removed: Confirm Password input */}
            {/* Submit button */}
            <div className='flex justify-center items-center'>
              <Input_Btn type="submit" disabled={loading} text={loading ? "Signing Up..." : "Sign Up"} name="Signup" />
            </div>
          </form>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
        </div>
        <div className="right_side">
          <img className='w-[548px] h-auto' src={signupbtn_full} alt="Signup Illustration" />
        </div>
      </div>
    </>
  );
};

export default SignupPage;
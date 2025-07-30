import React from 'react'; // Imports the React library.
import { Link } from 'react-router-dom'; // Imports Link component for navigation.
import mainLogo from '../assets/logo.png'; // Imports your main project logo image.
// Imports specific social media icons from react-icons/fa.
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => { // Defines the Footer functional component.
  return ( // Renders the JSX for the footer.
    <footer className="bg-[#3f49a5] text-gray-200 py-12 px-6 sm:px-10 lg:px-20 relative overflow-hidden">
      {/* Subtle background pattern/shape - adds a unique visual touch */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        {/* Abstract animated gradient circles for background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -top-1/2 -left-1/2 w-3/4 h-3/4 animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-orange-500/10 to-transparent rounded-full -bottom-1/3 -right-1/3 w-2/3 h-2/3 animate-pulse-fast"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto"> {/* Main content container, centered and responsive */}
        {/* Top Section: Logo & Tagline */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start border-b border-gray-600 pb-8 mb-8">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <Link to="/" className="flex items-center justify-center md:justify-start gap-3">
              <img src={mainLogo} alt="EaseStay Logo" className="h-10 w-auto" /> {/* Displays the main logo */}
              <span className="text-3xl font-extrabold text-white">EaseStay</span> {/* Displays the brand name */}
            </Link>
            <p className="mt-2 text-gray-300 max-w-sm">
              Your seamless journey to perfect hotel plans, just a click away. Explore, book, and relax. {/* Project tagline */}
            </p>
          </div>

          {/* Social Media Links (visible on desktop and larger screens) */}
          <div className="hidden md:flex flex-col items-center md:items-end gap-3">
            <p className="text-lg font-semibold text-white">Connect With Us</p> {/* Heading for social media */}
            <div className="flex space-x-4">
              {/* Social media links with corresponding icons */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300">
                <FaFacebook size={24} /> {/* Facebook icon */}
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300">
                <FaTwitter size={24} /> {/* Twitter icon */}
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300">
                <FaInstagram size={24} /> {/* Instagram icon */}
              </a>
              {/* Example of another icon, if needed: */}
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300">
                <FaLinkedin size={24} /> {/* LinkedIn icon */}
              </a>
            </div>
          </div>
        </div>

        {/* Middle Section: Navigation & Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 text-center md:text-left">
          {/* Section 1: Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#FF7A30]">Quick Links</h3> {/* Section heading */}
            <ul className="space-y-2"> {/* List of navigation links */}
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-300">About Us</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors duration-300">Our Services</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">Contact</Link></li>
            </ul>
          </div>

          {/* Section 2: User Account Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#FF7A30]">Your Account</h3> {/* Section heading */}
            <ul className="space-y-2"> {/* List of user-related links */}
              <li><Link to="/login" className="text-gray-300 hover:text-white transition-colors duration-300">Login</Link></li>
              <li><Link to="/signup" className="text-gray-300 hover:text-white transition-colors duration-300">Sign Up</Link></li>
              <li><Link to="/profile" className="text-gray-300 hover:text-white transition-colors duration-300">Profile</Link></li>
              <li><Link to="/profile/my-bookings" className="text-gray-300 hover:text-white transition-colors duration-300">My Bookings</Link></li>
            </ul>
          </div>

          {/* Section 3: Legal & Support Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#FF7A30]">Support</h3> {/* Section heading */}
            <ul className="space-y-2"> {/* List of support and legal links */}
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors duration-300">FAQ</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors duration-300">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors duration-300">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Section 4: Contact Information */}
          <div className="md:col-span-1 lg:col-span-1"> {/* Column layout for contact info */}
            <h3 className="text-xl font-semibold mb-4 text-[#FF7A30]">Get in Touch</h3> {/* Section heading */}
            <p className="text-gray-300 mb-2">
              123 Travel Lane, Suite 400 <br /> {/* Address line 1 */}
              Cityville, State 12345 {/* Address line 2 */}
            </p>
            <p className="text-gray-300 mb-2">Email: info@easestay.com</p> {/* Contact email */}
            <p className="text-gray-300">Phone: (123) 456-7890</p> {/* Contact phone */}
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-gray-600 pt-8 mt-8 text-center"> {/* Separator line and spacing */}
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} EaseStay. All rights reserved. {/* Dynamic copyright year */}
          </p>
          <p className="text-gray-500 text-xs mt-1">Designed with passion for seamless travel.</p> {/* Slogan */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
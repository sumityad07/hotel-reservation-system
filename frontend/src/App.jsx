import Navbar from './section/Navbar'
import {BrowserRouter as Router , Routes ,Route} from 'react-router-dom'
import Homepage from './pages/Homepage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/Profile'
import RoomListing from './pages/RoomListing'
import CreateRoomType from './pages/CreateRoomTypePage'
import RoomByHotel from './pages/RoomByHotel'
import BookingPage from "./pages/Bookingpage"
import BookingDetailsPage from './pages/BookingDetailsPage'
import MyBooking from './pages/MyBooking'
import SearchedHotel from './pages/SearchedHotel'
import useAuthStore from './store/authStore' // <--- KEEP THIS ONE (the first import)
import React, { useEffect } from 'react'; // Don't forget to import React and useEffect here!

// You'll also need to explicitly import PublishedHotel and Footer at the top
// since they are used in the JSX:
import PublishedHotel from './pages/PublishedHotel' // <--- Move this import to the top
import Footer from './pages/Footer'


function App() {

const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);


  return (

    <>

      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/signup" element={<SignupPage/>} />
          <Route path='/login' element ={<LoginPage/>}/>
          <Route path='/profile' element ={<ProfilePage/>}/>
          <Route path='/PublishedHotel' element ={<PublishedHotel/>}/>
          <Route path='/roomListing' element ={<RoomListing/>}/>
          <Route path="/roomListing/:id" element={<RoomListing />} />
          <Route path="/create-room-type/:hotelId" element={<CreateRoomType />} />
          <Route path="/room/byHotel/:hotelId" element={<RoomByHotel />} />
          <Route path="/book/:hotelId/:roomTypeId" element={<BookingPage />} />
          <Route path="/my-bookings/:id" element={<BookingDetailsPage />} />
          <Route path="/profile/my-bookings" element={<MyBooking />} />
          <Route path="/searchedHotel" element={<SearchedHotel />} />
        </Routes>
        <Footer/>

      </Router>

    </>
  )
}

// --- CRITICAL FIX: REMOVE THESE REDUNDANT IMPORTS ---
// import PublishedHotel from './pages/PublishedHotel' // <--- REMOVE THIS DUPLICATE
// import Footer from './pages/Footer' // <--- REMOVE THIS DUPLICATE
// import useAuthStore from './store/authStore' // <--- REMOVE THIS DUPLICATE

export default App
import React, { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { getCurrentUser } from '../services/authService';

function UserNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      currentUser.getSession((err) => {
        if (!err) setIsLoggedIn(true);
      });
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      currentUser.signOut(); // Clear session
      setIsLoggedIn(false); // Update state
      navigate('/login');
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link className="text-white text-xl font-bold" to='/' >Game Hub</Link>
        
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 text-white hover:text-gray-300 focus:outline-none"
          >
            <User className="h-6 w-6" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              {isLoggedIn ? (
                <>
                  <a
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </a>
                  <a
                    href="/signup"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Signup
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default UserNavbar;

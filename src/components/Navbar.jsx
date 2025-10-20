import { Link } from 'react-router-dom';
import React from 'react';

function Navbar() {
  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20"> {/* Increased height */}
          <Link to="/" className="text-3xl font-bold text-white"> {/* Increased font size */}
            GameHub
          </Link>
          <div className="flex space-x-6"> {/* Increased space between links */}
            <Link to="/games" className="text-gray-300 hover:text-white px-4 py-3 rounded-md text-lg"> {/* Increased padding and font size */}
              Games
            </Link>
            <Link to="/login" className="game-button px-5 py-3 text-lg"> {/* Increased padding and font size */}
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

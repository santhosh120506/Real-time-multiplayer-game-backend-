import { Link } from 'react-router-dom';
import { ArrowRightIcon, UserGroupIcon, SparklesIcon, TrophyIcon } from '@heroicons/react/24/outline';
import React from 'react';

function Home() {
  const features = [
    {
      icon: <UserGroupIcon className="h-6 w-6" />,
      title: "Real-time Multiplayer",
      description: "Play with friends and competitors from around the world in real-time matches."
    },
    {
      icon: <SparklesIcon className="h-6 w-6" />,
      title: "Multiple Games",
      description: "Choose from a variety of games including Chess, Tic-Tac-Toe, and Battle Arena."
    },
    {
      icon: <TrophyIcon className="h-6 w-6" />,
      title: "Competitive Gaming",
      description: "Track your scores, compete with others, and climb the leaderboard."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Navbar */}
      <nav className="bg-game-primary text-white py-4 px-6 fixed top-0 left-0 right-0 z-50 flex justify-between items-center shadow-md">
        <div className="text-2xl font-bold">
          GameHub
        </div>
        <div className="flex gap-6">
          <Link to="/games" className="hover:text-gray-300">Games</Link>
          <Link to="/leaderboard" className="hover:text-gray-300">Leaderboard</Link>
          <Link to="/register" className="hover:text-gray-300">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center py-24 px-4 mt-20">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-game-primary to-game-secondary bg-clip-text text-transparent">
          Welcome to GameHub
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Your ultimate destination for online multiplayer gaming. Challenge friends, compete with players worldwide, and experience the thrill of real-time gameplay.
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            to="/games" 
            className="game-button flex items-center gap-2 text-lg px-6 py-3"
          >
            Play Now
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
          <Link 
            to="/register" 
            className="px-6 py-3 text-lg border-2 border-game-primary text-game-primary rounded-lg hover:bg-game-primary hover:text-white transition-colors duration-200"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose GameHub?</h2>
        <div className="grid md:grid-cols-3 gap-8 px-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="game-card flex flex-col items-center text-center p-6 transform hover:scale-105 transition-transform duration-200"
            >
              <div className="text-game-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;

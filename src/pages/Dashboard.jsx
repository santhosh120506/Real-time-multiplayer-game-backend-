import { Link } from 'react-router-dom';
import React from 'react';
import Navbar from '/src/components/Navbar';
import UserNavbar from '../components/UserNavbar';


const games = [
  {
    id: 'tictactoe',
    title: 'Tic Tac Toe',
    description: 'Classic game of X\'s and O\'s',
    path: '/tictactoe',
    players: '2 Players'
  },
  {
    id: 'chess',
    title: 'Chess',
    description: 'Strategic board game of kings and queens',
    path: '/chess',
    players: '2 Players'
  }, 
  {
    id: 'battle-arena',
    title: 'Battle Arena',
    description: 'Fast-paced multiplayer combat game',
    path: '/battle-arena',
    players: '4 Players'
  }
];

function Dashboard() {
  return (
    <div>
    <UserNavbar/>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-center text-white mb-8"><br /><br />
          Choose Your Game
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link key={game.id} to={game.path}>
              <div className="game-card">
                <h2 className="text-xl font-bold mb-2">{game.title}</h2>
                <p className="text-gray-400 mb-4">{game.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{game.players}</span>
                  <button className="game-button">
                    Play Now
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      </div>
  );
}

export default Dashboard;
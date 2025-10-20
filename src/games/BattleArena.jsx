import { useState } from 'react';
import React from 'react';

function BattleArena() {
  const [message, setMessage] = useState('Battle Arena game is under development');

  return (
    <div className="flex flex-col items-center space-y-8">
      <h1 className="text-4xl font-bold">Battle Arena</h1>
      <div className="game-card w-full max-w-2xl">
        <p className="text-xl text-center">{message}</p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4).fill(null).map((_, i) => (
            <div key={i} className="relative">
              <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-6xl">👾</div>
              </div>
              <div className="mt-2 text-center">Player {i + 1}</div>
              <div className="mt-1 w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BattleArena;
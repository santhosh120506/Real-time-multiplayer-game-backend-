import { useState } from 'react';
import React from 'react';

function Chess() {
  const [message, setMessage] = useState('Chess game is under development');

  return (
    <div className="flex flex-col items-center space-y-8">
      <h1 className="text-4xl font-bold">Chess</h1>
      <div className="game-card">
        <p className="text-xl text-center">{message}</p>
        <div className="grid grid-cols-8 gap-0 w-96 h-96 mt-8">
          {Array(64).fill(null).map((_, i) => {
            const row = Math.floor(i / 8);
            const isLight = (row + i) % 2 === 0;
            return (
              <div
                key={i}
                className={`w-12 h-12 ${
                  isLight ? 'bg-amber-100' : 'bg-amber-800'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Chess;
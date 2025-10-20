import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Square, User, KeyRound, Copy, Trophy } from 'lucide-react';
import UserNavbar from '../components/UserNavbar';
import { createRoom as createRoomService, joinRoom as joinRoomService, makeMove, pollGameState } from '../services/gameService';

const ConfettiCelebration = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-50">
      {[...Array(100)].map((_, i) => {
        const randomColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        const randomSize = `${Math.random() * 8 + 4}px`;
        const randomLeft = `${Math.random() * 100}vw`;
        const randomAnimationDelay = `${Math.random() * 3}s`;
        const randomAnimationDuration = `${Math.random() * 3 + 2}s`;

        return (
          <div
            key={i}
            className="absolute rounded-full animate-confetti"
            style={{
              left: randomLeft,
              top: '-10px',
              width: randomSize,
              height: randomSize,
              backgroundColor: randomColor,
              animationDelay: randomAnimationDelay,
              animationDuration: randomAnimationDuration,
            }}
          />
        );
      })}
    </div>
  );
};

const Board = ({ board, onSquareClick, currentTurn, playerId }) => {
  return (
    <div className="grid grid-cols-3 gap-4 w-[28rem] h-[28rem] mx-auto">
      {board.map((value, index) => (
        <button
          key={index}
          onClick={() => onSquareClick(index)}
          disabled={value !== null || currentTurn !== playerId}
          className={`h-full w-full bg-gray-800 rounded-xl shadow-lg flex items-center justify-center text-6xl font-bold
            ${value === null && currentTurn === playerId ? 'hover:bg-gray-700 cursor-pointer' : 'cursor-not-allowed'}
            ${value === 'X' ? 'text-blue-500' : 'text-red-500'}
            transition-all duration-200`}
        >
          {value === null ? (
            <Square className="w-12 h-12 text-gray-500" />
          ) : (
            value
          )}
        </button>
      ))}
    </div>
  );
};

const PlayerScore = ({ player, isCurrentTurn, isWaiting }) => {
  return (
    <div className={`p-6 rounded-xl shadow-lg ${isCurrentTurn ? 'bg-gray-800 ring-2 ring-blue-500' : 'bg-gray-700'} min-w-[240px]`}>
      <div className="flex items-center space-x-3 mb-4">
        <User className={`w-6 h-6 ${player.symbol === 'X' ? 'text-blue-500' : 'text-red-500'}`} />
        <div>
          <span className="font-semibold text-white">{player.name}</span>
          <span className={`ml-2 text-sm ${player.symbol === 'X' ? 'text-blue-400' : 'text-red-400'}`}>
            ({player.symbol})
          </span>
        </div>
      </div>
      {isWaiting ? (
        <div className="text-center py-4 text-gray-300">Waiting for opponent...</div>
      ) : (
        <div className="text-center">
          <span className="text-3xl font-bold text-white">{player.score}</span>
          <p className="text-sm text-gray-400">Score</p>
        </div>
      )}
    </div>
  );
};

const RoomJoin = ({ onJoinRoom, onCreateRoom }) => {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    isJoining ? onJoinRoom(roomCode, playerName) : onCreateRoom(playerName);
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
      <div className="flex justify-center mb-6">
        <KeyRound className="w-12 h-12 text-blue-500" />
      </div>
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        {isJoining ? 'Join Game Room' : 'Create Game Room'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          id="playerName" 
          value={playerName} 
          onChange={(e) => setPlayerName(e.target.value)}
          className="block w-full bg-gray-900 text-white rounded-md px-4 py-2" 
          required 
          placeholder="Your Name" 
        />
        {isJoining && (
          <div className="relative">
            <input 
              type="text" 
              id="roomCode" 
              value={roomCode} 
              onChange={(e) => setRoomCode(e.target.value)}
              className="block w-full bg-gray-900 text-white rounded-md px-4 py-2 pr-10" 
              required 
              placeholder="Room Code" 
            />
            <button 
              type="button" 
              onClick={() => navigator.clipboard.writeText(roomCode)}
              className="absolute right-2 top-2 text-gray-400 hover:text-white"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        )}
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          {isJoining ? 'Join Room' : 'Create Room'}
        </button>
        <button 
          type="button" 
          onClick={() => setIsJoining(!isJoining)} 
          className="w-full text-blue-500 underline text-sm hover:text-blue-400 transition-colors"
        >
          {isJoining ? 'Create a new room instead' : 'Join an existing room instead'}
        </button>
      </form>
    </div>
  );
};

function TicTacToe() {
  const [room, setRoom] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [winnerName, setWinnerName] = useState('');

  const createRoom = async (playerName) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await createRoomService({ playerName });
      
      if (!response?.roomId || !response?.playerId) {
        throw new Error('Invalid response from server');
      }

      const newPlayer = { 
        id: response.playerId, 
        name: playerName, 
        score: 0, 
        symbol: "X" 
      };
      
      const newRoom = { 
        id: response.roomId, 
        players: [newPlayer], 
        gameState: { 
          board: Array(9).fill(null), 
          currentTurn: response.playerId, 
          winner: null, 
          gameOver: false 
        } 
      };

      setRoom(newRoom);
      setCurrentPlayer(newPlayer);
    } catch (error) {
      console.error("Error creating room:", error);
      setError(error.message || 'Failed to create room');
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async (roomId, playerName) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await joinRoomService({ roomId, playerName });
      
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to join room');
      }
  
      const newPlayer = {
        id: response.playerId,
        name: playerName,
        score: 0,
        symbol: 'O',
        role: "player2"
      };
  
      const updatedRoom = {
        id: roomId,
        players: [
          {
            id: response.player1Id,
            name: response.player1Name,
            score: 0,
            symbol: 'X',
            role: "player1"
          },
          newPlayer
        ],
        gameState: {
          board: Array(9).fill(null),
          currentTurn: response.currentTurn || response.player1Id,
          winner: null,
          gameOver: false
        }
      };
  
      setRoom(updatedRoom);
      setCurrentPlayer(newPlayer);
      
    } catch (error) {
      console.error("Error joining room:", error);
      setError(error.message || 'Failed to join room');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (room?.id) {
      const interval = setInterval(async () => {
        try {
          const gameState = await pollGameState(room.id);
          const newGameState = {
            board: gameState.board.map(cell => cell.NULL ? null : cell.S),
            currentTurn: gameState.currentTurn,
            winner: gameState.winner,
            gameOver: gameState.gameOver,
            players: gameState.players || room.players
          };

          if (newGameState.gameOver && newGameState.winner && !room.gameState.gameOver) {
            let winnerName = '';
            const winnerById = room.players.find(p => p.id === newGameState.winner);
            
            if (!winnerById) {
              if (newGameState.winner === "player1") {
                winnerName = room.players[0]?.name || 'Player 1';
              } else if (newGameState.winner === "player2" && room.players[1]) {
                winnerName = room.players[1]?.name || 'Player 2';
              } else {
                winnerName = 'Player';
              }
            } else {
              winnerName = winnerById.name;
            }

            setWinnerName(winnerName);
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 5000);
          }

          setRoom(prev => ({
            ...prev,
            gameState: newGameState
          }));
        } catch (error) {
          console.error("Polling error:", error);
        }
      }, 2000);
      
      setPollingInterval(interval);
      return () => clearInterval(interval);
    }
  }, [room?.id]);

  const handleSquareClick = async (index) => {
    if (!room || !currentPlayer || 
        room.gameState.currentTurn !== currentPlayer.id || 
        room.gameState.board[index] !== null ||
        room.gameState.gameOver) {
      return;
    }
    
    try {
      await makeMove(room.id, currentPlayer.id, index);
    } catch (error) {
      console.error("Move failed:", error);
      setError(error.message || 'Failed to make move');
    }
  };

  const renderGameContent = () => {
    if (!room || !currentPlayer) {
      return (
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <RoomJoin onJoinRoom={joinRoom} onCreateRoom={createRoom} />
          {isLoading && (
            <div className="mt-4 p-4 bg-gray-800 text-white rounded-xl">
              Loading...
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-500 text-white rounded-xl">
              {error}
            </div>
          )}
        </div>
      );
    }

    const currentPlayerTurn = room.players.find(p => p.id === room.gameState.currentTurn);
    const player1 = room.players[0];
    const player2 = room.players[1];


    return (
      <div className="max-w-6xl mx-auto">
        {showCelebration && <ConfettiCelebration />}
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Tic Tac Toe</h1>
          <div className="flex items-center space-x-4">
            <div className="bg-gray-800 px-4 py-2 rounded-md text-white flex items-center">
              <span>Room: {room.id}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(room.id)}
                className="ml-2 text-gray-400 hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Player 1 (always left) */}
          <div className="order-1 w-full md:w-auto">
            <PlayerScore 
              player={player1}
              isCurrentTurn={room.gameState.currentTurn === player1.id}
            />
          </div>
          
          {/* Game Board (always center) */}
          <div className="order-2">
            <Board 
              board={room.gameState.board} 
              onSquareClick={handleSquareClick} 
              currentTurn={room.gameState.currentTurn} 
              playerId={currentPlayer.id} 
            />
          </div>
          
          {/* Player 2 or waiting message (always right) */}
          <div className="order-3 w-full md:w-auto">
            {player2 ? (
              <PlayerScore 
                player={player2}
                isCurrentTurn={room.gameState.currentTurn === player2.id}
              />
            ) : (
              <div className="p-6 rounded-lg shadow-md bg-gray-700 text-center">
                <div className="text-gray-300">Waiting for opponent...</div>
              </div>
            )}
          </div>
        </div>

        {room.gameState.gameOver && (
          <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-70">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-8 rounded-xl shadow-2xl text-center max-w-md w-full animate-bounce-in">
              <div className="flex justify-center mb-4">
                <Trophy className="w-16 h-16 text-white" fill="currentColor" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {room.gameState.winner ? (
                  <>
                    {winnerName} Wins!
                    <div className="text-sm mt-2 font-normal">🏆 Champion! 🏆</div>
                  </>
                ) : "It's a Draw!"}
              </h2>
              <p className="text-white mb-6">
                {room.gameState.winner ? 'Congratulations on your victory!' : 'Great game! Try again!'}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-white text-yellow-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {!room.gameState.gameOver && (
          <div className="mt-4 p-4 bg-blue-500 text-white rounded-md text-center">
            {currentPlayerTurn ? `${currentPlayerTurn.name}'s turn (${currentPlayerTurn.symbol})` : "Waiting for opponent..."}
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-500 text-white rounded-md">
            {error}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <UserNavbar />
      {renderGameContent()}
    </div>
  );
}

export default TicTacToe;
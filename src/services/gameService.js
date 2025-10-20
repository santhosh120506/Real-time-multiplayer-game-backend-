const API_BASE_URL = 'https://8kqz2ifazl.execute-api.ap-southeast-1.amazonaws.com/prod'; 

export const createRoom = async ({ playerName }) => {
  try {
    const response = await fetch('https://8kqz2ifazl.execute-api.ap-southeast-1.amazonaws.com/prod/create-room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playerName }),
    });

    if (!response.ok) {
      // Try to parse error response
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `HTTP error! status: ${response.status}` };
      }
      throw new Error(errorData.message || 'Failed to create room');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating room:', error);
    throw new Error(error.message || 'Network error. Please check your connection.');
  }
};

export const joinRoom = async ({ roomId, playerName }) => {
  try {
    const response = await fetch('https://8kqz2ifazl.execute-api.ap-southeast-1.amazonaws.com/prod/join-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, playerName })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to join room');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Full error details:", error);
    throw new Error(error.message || "Network error. Check console for details.");
  }
};

export const makeMove = async (roomId, playerId, moveIndex) => {
  const response = await fetch(`${API_BASE_URL}/make-move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomId, playerId, moveIndex })
  });
  return await response.json();
};

export const pollGameState = async (roomId) => {
  const response = await fetch(`${API_BASE_URL}/poll-game`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomId })
  });
  return await response.json();
};
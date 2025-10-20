import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '/src/pages/Dashboard';
import Login from '/src/auth/Login';
import Register from '/src/auth/Register';
import TicTacToe from './games/TicTacToe';
import Home from './pages/Home';

import Profile from './pages/Profile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/games" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tictactoe" element={<TicTacToe />} />
        
      </Routes>
    </Router>
  );
};

export default App;
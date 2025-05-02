import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Create from './Create';
import Explore from './Explore';
import Home1 from './Home1';
import Profile from './Profile';
import Index from '../components/sidebar/index';
import Login from './Login';
import './Home.css';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      <Routes>
        {!isLoggedIn ? (
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        ) : (
          <Route
            path="*"
            element={
              <div className="main">
                <Index />
                <Routes>
                  <Route path="/create" element={<Create />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/home" element={<Home1 />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<Navigate to="/home" />} />
                </Routes>
              </div>
            }
          />
        )}
      </Routes>
    </div>
  );
}

export default Home;

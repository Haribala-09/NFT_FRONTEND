import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import Login from './screens/Login';
import Profile from './screens/Profile';
import Explore from './screens/Explore';
import UploadPage from './components/uploadpage/uploadpage';
import Navbar from './components/Navbar/Navbar';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/explore" />} />
        <Route path="/explore" element={user ? <Explore /> : <Navigate to="/login" />} />
        <Route path="/upload" element={user ? <UploadPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={user ? "/explore" : "/login"} />} />
      </Routes>
    </div>
  );
}

export default App;

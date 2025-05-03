// src/screens/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../firebase'; // Correct import of 'database' from firebase.jsx
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set, get } from 'firebase/database'; // Realtime Database functions
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    location: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { username, email, location, password } = formData;

    if (!username || !email || !location || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // First try to sign in
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userRef = ref(database, `users/${userCredential.user.uid}`);
        const snapshot = await get(userRef);
        
        if (!snapshot.exists()) {
          // If user exists in auth but not in database, create their profile
          await set(userRef, {
            username,
            email,
            location,
            createdAt: Date.now()
          });
        }
        
        navigate('/explore');
        return;
      } catch (loginError) {
        // If sign in fails with invalid credential, try to create new account
        if (loginError.code === 'auth/invalid-credential') {
          // Try to create new account
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          
          // Save user data to Realtime Database
          await set(ref(database, `users/${userCredential.user.uid}`), {
            username,
            email,
            location,
            createdAt: Date.now()
          });

          navigate('/explore');
          return;
        }
        throw loginError;
      }
    } catch (error) {
      console.error('Auth error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please try logging in.');
      } else if (error.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginmain">
      <div className="logincontainer">
        <h2>WELCOME</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

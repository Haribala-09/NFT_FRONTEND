// src/screens/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../firebase'; // Correct import of 'database' from firebase.jsx
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database'; // Realtime Database functions
import './Login.css';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    location: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, location, password } = formData;

    if (!username || !email || !location || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // First attempt to sign up user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // If new user is created, save to the Realtime Database
      await set(ref(database, 'users/' + userCredential.user.uid), {
        username,
        email,
        location,
      });

      alert('User signed up successfully!');
      onLogin(formData); // Update parent component's state
      navigate('/profile'); // Navigate to profile page after successful sign-up

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        // If email is already in use, attempt login
        try {
          await signInWithEmailAndPassword(auth, email, password);
          alert('Login successful!');
          onLogin(formData); // Update parent component's state
          navigate('/profile'); // Navigate to profile page
        } catch (loginError) {
          // If login fails, show appropriate error message
          if (loginError.code === 'auth/invalid-credential') {
            alert('Invalid credentials. Please try again.');
          } else {
            alert('Login failed: ' + loginError.message);
          }
        }
      } else {
        // If there's another error during sign-up
        alert('Error during sign-up: ' + error.message);
      }
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
          <button type="submit">LOGIN</button>
        </form>
      </div>
    </div>
  );
}

export default Login;

import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from '../firebase'; // Import auth to get the current user
import './Profile.css';
import profilePic from '../assets/11539820.png'; 

const Profile = () => {
  const [userData, setUserData] = useState(null); // State to hold user data
  const [loading, setLoading] = useState(true); // State to handle loading state

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser; // Get the current authenticated user
      if (user) {
        const userRef = ref(getDatabase(), 'users/' + user.uid); // Reference to the user's data in Realtime Database
        const snapshot = await get(userRef); // Fetch the user data

        if (snapshot.exists()) {
          setUserData(snapshot.val()); // Update state with the fetched data
        } else {
          console.log("No user data found");
        }
      }
      setLoading(false); // Set loading to false once data is fetched
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  return (
    <div className="p-container">
      <div className="profile-header">
        <div className="profile-image">
          <img src={profilePic} alt="profile" />
        </div>
        <div className="profile-info">
          <h2>UserName&nbsp;&nbsp;:&nbsp;{userData ? userData.username : 'User Name'}</h2>
          <h2>Email&emsp;&nbsp;&nbsp;&emsp;: {userData ? userData.email : 'user@example.com'}</h2>
          <h2>Location&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {userData ? userData.location : 'City, Country'}</h2>
        </div>
      </div>

      <div className="profile-sections">
        <div className="about-me">
          <h3>About Me</h3>
          <p>{userData ? 'Some description about the user.' : 'No description available.'}</p>
        </div>
        <div className="activity">
          <h3>My Activity</h3>
          <p>{userData ? 'User\'s recent activity details.' : 'No activity available.'}</p>
        </div>
      </div>
      <div className="edit-button-container">
        <button className="edit-button">Wallet</button>
      </div>
    </div>
  );
};

export default Profile;

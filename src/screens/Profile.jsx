import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from '../firebase'; // Import auth to get the current user
import './Profile.css';
import profilePic from '../assets/11539820.png'; 
import Card from '../components/Card/Card';

const Profile = () => {
  const [userData, setUserData] = useState(null); // State to hold user data
  const [userUploads, setUserUploads] = useState([]);
  const [userPurchases, setUserPurchases] = useState([]);
  const [loading, setLoading] = useState(true); // State to handle loading state

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser; // Get the current authenticated user
      if (user) {
        const userRef = ref(getDatabase(), 'users/' + user.uid); // Reference to the user's data in Realtime Database
        const uploadsRef = ref(getDatabase(), `users/${user.uid}/uploads`);
        const purchasesRef = ref(getDatabase(), `users/${user.uid}/purchases`);
        
        try {
          const [userSnapshot, uploadsSnapshot, purchasesSnapshot] = await Promise.all([
            get(userRef),
            get(uploadsRef),
            get(purchasesRef)
          ]);

          if (userSnapshot.exists()) {
            setUserData(userSnapshot.val()); // Update state with the fetched data
          }

          if (uploadsSnapshot.exists()) {
            const uploads = uploadsSnapshot.val();
            const uploadsArray = Object.values(uploads).sort((a, b) => b.timestamp - a.timestamp);
            setUserUploads(uploadsArray);
          }

          if (purchasesSnapshot.exists()) {
            const purchases = purchasesSnapshot.val();
            const purchasesArray = Object.values(purchases).sort((a, b) => b.timestamp - a.timestamp);
            setUserPurchases(purchasesArray);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      setLoading(false); // Set loading to false once data is fetched
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  if (!auth.currentUser) {
    return (
      <div className="p-container">
        <div className="error-message">Please sign in to view your profile</div>
      </div>
    );
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
        
        <div className="my-uploads">
          <h3>My Uploads</h3>
          <div className="uploads-grid">
            {userUploads.map((upload) => (
              <Card
                key={upload.id}
                id={upload.id}
                cardname={upload.name}
                cardpara={upload.description}
                cardcost="N/A"
                cardpic={`https://gateway.pinata.cloud/ipfs/${upload.ipfsHash}`}
                ipfsHash={upload.ipfsHash}
              />
            ))}
          </div>
        </div>

        <div className="my-purchases">
          <h3>My Purchases</h3>
          <div className="purchases-grid">
            {userPurchases.map((purchase) => (
              <Card
                key={purchase.purchaseId}
                id={purchase.itemId}
                cardname={purchase.name}
                cardpara={purchase.description}
                cardcost={purchase.cost}
                cardpic={`https://gateway.pinata.cloud/ipfs/${purchase.ipfsHash}`}
                ipfsHash={purchase.ipfsHash}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="edit-button-container">
        <button className="edit-button">Wallet</button>
      </div>
    </div>
  );
};

export default Profile;

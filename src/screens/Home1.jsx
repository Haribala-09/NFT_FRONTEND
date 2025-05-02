import React, { useState, useEffect } from "react";
import { database } from "../firebase"; // Import Realtime Database
import { ref, get } from "firebase/database"; // Realtime Database functions
import "./Home1.css";

const Home1 = () => {
  const [nfts, setNfts] = useState([]); // State to hold fetched NFTs
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error messages

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        // Reference to Realtime Database 'nfts/{user.uid}' path
        const nftRef = ref(database, 'nfts'); // Fetch NFTs from root or all users
        const snapshot = await get(nftRef);

        if (!snapshot.exists()) {
          setError("No NFTs found in the Realtime Database.");
        } else {
          const data = snapshot.val();
          const nftsArray = [];
          for (const userId in data) {
            for (const nftId in data[userId]) {
              nftsArray.push(data[userId][nftId]);
            }
          }
          setNfts(nftsArray); // Update state with the fetched NFTs
        }
      } catch (error) {
        setError("Error fetching data from Realtime Database.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs(); // Call the function to fetch NFTs
  }, []);

  return (
    <div className="nft-animation-container">
      <div className="hero-section">
        <h1 className="hero-title">DISCOVER AND TRADE EXCLUSIVE NFTs</h1>
        <p className="hero-description">
          The best place to explore, buy, and sell rare NFTs from top creators.
        </p>
      </div>

      <div className="trending-wrapper">
        <h2 className="trending-title">Trending NFTs</h2>
        <div className="trending-list">
          {loading ? (
            <p>Loading trending NFTs...</p>
          ) : error ? (
            <p>{error}</p>
          ) : nfts.length > 0 ? (
            nfts.map((nft, index) => (
              <div key={index} className="trending-item">
                <span className="nft-name">{nft.name}</span>
                <span className="author">by {nft.author || "Anonymous"}</span>
                <span className="price">{nft.price} ETH</span>
              </div>
            ))
          ) : (
            <p>No NFTs available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home1;

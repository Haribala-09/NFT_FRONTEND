import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import Card from '../components/Card/Card';
import './Explore.css';

const Explore = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uploadsRef = ref(database, 'uploads/');
    const unsubscribe = onValue(uploadsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const uploadsList = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
        setUploads(uploadsList);
      } else {
        setUploads([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="explore">
      <h2>Explore NFTs</h2>
      <div className="explore-grid">
        {uploads.map((item) => (
          <Card
            key={item.id}
            id={item.id}
            cardname={item.name}
            cardpara={item.description || "No description available"}
            cardcost="0.1 ETH"
            cardpic={`https://gateway.pinata.cloud/ipfs/${item.ipfsHash}`}
            ipfsHash={item.ipfsHash}
          />
        ))}
      </div>
    </div>
  );
};

export default Explore;

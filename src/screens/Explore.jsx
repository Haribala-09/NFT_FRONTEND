import React, { useEffect, useState } from 'react';
import { ref, onValue, remove } from 'firebase/database';
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
        const uploadsList = Object.entries(data).map(([key, value]) => ({
          ...value,
          id: key, // Use Firebase key as ID if not already set
        })).sort((a, b) => b.timestamp - a.timestamp);
        setUploads(uploadsList);
      } else {
        setUploads([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCardPurchase = async (purchasedCardId) => {
  const card = uploads.find((item) => item.id === purchasedCardId);
  if (!card) {
    console.error('Card not found.');
    return;
  }

  try {
    const response = await fetch('http://192.168.79.45:8200/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          id: card.id,
          name: card.name,
          description: card.description,
          ipfsHash: card.ipfsHash,
          timestamp: card.timestamp,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      return;
    }

    console.log('Backend responded with success, now deleting from Firebase...');
    const itemRef = ref(database, `uploads/${purchasedCardId}`);
    await remove(itemRef);
    setUploads((prev) => prev.filter((item) => item.id !== purchasedCardId));
  } catch (error) {
    console.error('Error during purchase process:', error);
  }
};


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
            onPurchaseSuccess={() => handleCardPurchase(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Explore;

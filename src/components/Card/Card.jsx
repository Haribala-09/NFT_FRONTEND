import React, { useState } from 'react';
import { auth, database } from '../../firebase';
import { ref, set, get } from 'firebase/database';
import './Card.css';

const Card = ({ id, cardname, cardpara, cardcost, cardpic, ipfsHash }) => {
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleBuy = async () => {
    if (!auth.currentUser) {
      setError('Please sign in to make a purchase');
      return;
    }

    setBuying(true);
    setError('');
    setSuccess('');

    try {
      // Make HTTP request with image ID
      const response = await fetch('http://localhost:3000/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId: id
        })
      });

      if (!response.ok) {
        throw new Error('Purchase request failed');
      }

      const data = await response.json();
      
      if (data.success) {
        // Create purchase record
        const purchaseId = `${id}_${Date.now()}`;
        const newPurchaseRef = ref(database, `users/${auth.currentUser.uid}/purchases/${purchaseId}`);
        
        await set(newPurchaseRef, {
          purchaseId,
          itemId: id,
          name: cardname,
          description: cardpara,
          ipfsHash: ipfsHash,
          cost: cardcost,
          timestamp: Date.now(),
          imageUrl: cardpic
        });

        setSuccess('Purchase successful!');
      } else {
        throw new Error(data.message || 'Purchase failed');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      setError(error.message);
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="card">
      <div className="card-image">
        <img src={cardpic} alt={cardname} />
      </div>
      <div className="card-content">
        <h1 className="card-title">{cardname}</h1>
        <p className="card-para">{cardpara}</p>
        <div className="card-footer">
          <h1 className="cost">{cardcost}</h1>
          <button 
            className={`buy-button ${buying ? 'buying' : ''}`} 
            onClick={handleBuy}
            disabled={buying}
          >
            {buying ? 'Processing...' : 'Buy'}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>
    </div>
  );
};

export default Card;

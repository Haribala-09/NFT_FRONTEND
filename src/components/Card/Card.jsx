import React, { useState } from 'react';
import { auth, database } from '../../firebase';
import { ref, set } from 'firebase/database';
import './Card.css';

const Card = ({ id, cardname, cardpara, cardcost, cardpic, ipfsHash, onPurchaseSuccess }) => {
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
      // Fire-and-forget request (don't wait for or parse response)
      fetch('http://192.168.228.202:8200/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: "txn",
          data: {
            who: "yuvaraji",
            img_id: id
          }
        })
      });

      // Immediately mark as purchased
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
      if (onPurchaseSuccess) {
        onPurchaseSuccess();
      }

    } catch (error) {
      console.error('Purchase error:', error);
      setError('Something went wrong. Try again.');
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

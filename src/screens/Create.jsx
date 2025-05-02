import React, { useState } from 'react';
import { ref as dbRef, push, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from '../firebase'; // Import Firebase functions
import './Create.css';

const Create = ({ user }) => {
  const [nftData, setNftData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setNftData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value, // Store the file directly (not URL.createObjectURL)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, price, image } = nftData;

    if (!name || !description || !price || !image) {
      alert('All fields are required.');
      return;
    }

    try {
      // 1. Upload the image to Firebase Storage
      const imageRef = storageRef(storage, `nfts/${user.uid}/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      // 2. Push NFT data to Realtime Database under the user's node
      const nftRef = dbRef(database, `nfts/${user.uid}`); // Use user's UID to store NFTs under their node
      const newNftRef = push(nftRef); // Push a new child under nfts/{user.uid}

      await set(newNftRef, {
        name,
        description,
        price,
        imageUrl, // Save the image URL in the database
        createdAt: Date.now(),
      });

      alert('🎉 NFT created successfully!');

      // Reset form
      setNftData({
        name: '',
        description: '',
        price: '',
        image: null,
      });
    } catch (error) {
      console.error('Error creating NFT:', error);
      alert('Failed to create NFT. Please try again.');
    }
  };

  return (
    <div className="create-container">
      <form id="create-nft-form" onSubmit={handleSubmit}>
        <label htmlFor="name">NFT Name:</label>
        <input type="text" id="name" name="name" value={nftData.name} onChange={handleChange} />

        <label htmlFor="description">Description:</label>
        <textarea id="description" name="description" rows="4" cols="50" value={nftData.description} onChange={handleChange}></textarea>

        <label htmlFor="price">Price (ETH):</label>
        <input type="number" id="price" name="price" step="0.01" min="0" value={nftData.price} onChange={handleChange} />

        <label htmlFor="image">Upload Image:</label>
        <input type="file" id="image" name="image" accept="image/*" onChange={handleChange} />

        <button type="submit">Create NFT</button>
      </form>
    </div>
  );
};

export default Create;

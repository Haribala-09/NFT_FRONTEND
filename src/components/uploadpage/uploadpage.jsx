import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ref, set } from 'firebase/database';
import { auth, database } from '../../firebase';
import './UploadPage.css';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!isAuthenticated) {
      setError('Please sign in to upload files');
      return;
    }

    if (!file) {
      setError('Please select a file');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
        },
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error('Failed to upload to Pinata');
      }

      const data = await res.json();
      const ipfsHash = data.IpfsHash;
      const uniqueId = uuidv4();
      const user = auth.currentUser;

      if (user) {
        try {
          // Store in Firebase Realtime Database
          const uploadRef = ref(database, `uploads/${uniqueId}`);
          await set(uploadRef, {
            id: uniqueId,
            uid: user.uid,
            ipfsHash,
            name: title,
            description: description,
            fileName: file.name,
            timestamp: Date.now(),
            userEmail: user.email
          });

          // Also store in user's uploads
          const userUploadRef = ref(database, `users/${user.uid}/uploads/${uniqueId}`);
          await set(userUploadRef, {
            id: uniqueId,
            ipfsHash,
            name: title,
            description: description,
            fileName: file.name,
            timestamp: Date.now()
          });

          setSuccess('Upload successful!');
          // Reset form
          setFile(null);
          setTitle('');
          setDescription('');
          setPreview(null);
        } catch (dbError) {
          console.error('Database error:', dbError);
          throw new Error('Failed to save to database: ' + dbError.message);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="upload-page">
        <div className="upload-form">
          <div className="error-message">Please sign in to upload files</div>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-page">
      <div className={`upload-form ${uploading ? 'uploading' : ''}`}>
        <input 
          type="text" 
          placeholder="Enter title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={uploading}
        />
        <textarea 
          placeholder="Enter description" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={uploading}
        />
        <input 
          type="file" 
          onChange={handleFileChange}
          accept="image/*"
          disabled={uploading}
        />
        {preview && (
          <div className="preview-section">
            <h3>Preview:</h3>
            <img src={preview} alt="Preview" />
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
};

export default UploadPage;

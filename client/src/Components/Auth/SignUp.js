// client/src/components/Auth/Signup.js
import React, { useState } from 'react';
import axios from 'axios';

const Signup = ({ onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/createuser', { name, email, password, userid: userId });
      console.log(response);
      
      onSignup(response.data);
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default Signup;

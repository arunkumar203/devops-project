// client/src/components/Navbar/Navbar.js
import React from 'react';
import '../shared/Navbar.css';

const Navbar = ({ isLoggedIn, onLogout, onSelectView }) => (
  <nav className="navbar">
    <h2>My Courses App</h2>
    {isLoggedIn ? (
      <>
        <button onClick={() => onSelectView('home')}>Home</button>
        <button onClick={() => onSelectView('edit')}>Edit Courses</button>
        <button onClick={() => onSelectView('create')}>Create Course</button>
        <button onClick={onLogout}>Logout</button>
      </>
    ) : (
      <p>Please log in to access courses.</p>
    )}
  </nav>
);

export default Navbar;
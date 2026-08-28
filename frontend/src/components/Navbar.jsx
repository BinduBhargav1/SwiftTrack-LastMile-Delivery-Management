import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="top-nav">
      <div className="brand">
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'inherit' }}>SwiftTrack</Link>
      </div>
      <div className="links">
        <Link to="/login" className="btn btn-outline" style={{ marginRight: '1rem' }}>Login</Link>
        <Link to="/register" className="btn">Register</Link>
      </div>
    </nav>
  );
}

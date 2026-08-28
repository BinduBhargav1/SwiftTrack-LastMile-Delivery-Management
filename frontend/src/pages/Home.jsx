import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1>Welcome to SwiftTrack Delivery</h1>
      <p style={{ maxWidth: '600px', margin: '1rem auto', color: 'var(--text-color)' }}>
        Your reliable last-mile delivery partner. Book, track, and manage your shipments with ease.
      </p>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/login" className="btn btn-outline" style={{ marginRight: '1rem' }}>Login</Link>
        <Link to="/register" className="btn">Get Started</Link>
      </div>
    </div>
  );
}

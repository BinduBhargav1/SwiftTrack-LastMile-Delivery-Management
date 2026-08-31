import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ onLogout }) {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <nav className="top-nav">
      <div className="brand">
        <Link to="/" style={{ fontSize: '1.2rem', fontWeight: '600', color: '#fff', letterSpacing: '0.5px' }}>
          <span style={{ color: 'var(--primary)' }}>Swift</span>Track
        </Link>
      </div>
      
      {!user && (
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase' }}>
           <a href="#services" style={{ color: 'var(--text-muted)' }}>Services</a>
           <a href="#team" style={{ color: 'var(--text-muted)' }}>Team</a>
           <a href="#networks" style={{ color: 'var(--text-muted)' }}>Networks</a>
           <a href="#support" style={{ color: 'var(--text-muted)' }}>Support</a>
        </div>
      )}

      <div className="links" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
           <>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.name}</span>
            <button onClick={onLogout} className="btn btn-outline" style={{ padding: '0.5rem 1.5rem' }}>Logout</button>
           </>
        ) : (
           <>
            <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.5rem', border: 'none' }}>Login</Link>
            <Link to="/register" className="btn" style={{ padding: '0.5rem 1.5rem' }}>Register</Link>
           </>
        )}
      </div>
    </nav>
  );
}

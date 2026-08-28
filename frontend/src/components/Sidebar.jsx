import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar({ role, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <h2 className="mb-4">SwiftTrack</h2>
      {role === 'customer' && (
        <ul style={{ listStyle: 'none' }}>
          <li className="mb-2"><Link to="/customer/dashboard">Dashboard</Link></li>
          <li className="mb-2"><Link to="/customer/create-order">Create Order</Link></li>
          <li className="mb-2"><Link to="/customer/orders">My Orders</Link></li>
        </ul>
      )}
      {role === 'agent' && (
        <ul style={{ listStyle: 'none' }}>
          <li className="mb-2"><Link to="/agent/dashboard">Dashboard</Link></li>
          <li className="mb-2"><Link to="/agent/orders">Assigned Orders</Link></li>
        </ul>
      )}
      {role === 'admin' && (
        <ul style={{ listStyle: 'none' }}>
          <li className="mb-2"><Link to="/admin/dashboard">Dashboard</Link></li>
          <li className="mb-2"><Link to="/admin/orders">Orders</Link></li>
          <li className="mb-2"><Link to="/admin/agents">Agents</Link></li>
          <li className="mb-2"><Link to="/admin/zones">Zones</Link></li>
          <li className="mb-2"><Link to="/admin/points">Pickup/Drop Points</Link></li>
          <li className="mb-2"><Link to="/admin/rate-cards">Rate Cards</Link></li>
        </ul>
      )}
      <button className="btn btn-outline" style={{ marginTop: 'auto', width: '100%' }} onClick={handleLogout}>Logout</button>
    </div>
  );
}

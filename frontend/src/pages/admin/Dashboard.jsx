import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    
    fetch('http://localhost:5000/api/admin/dashboard')
      .then(res => res.json())
      .then(data => setStats(data));
  }, [navigate, user]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
        <div className="card text-center" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/orders')}>
          <h3>{stats.total_orders || 0}</h3>
          <p>Total Orders</p>
        </div>
        <div className="card text-center" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/agents')}>
          <h3>{stats.active_agents || 0}</h3>
          <p>Active Agents</p>
        </div>
        <div className="card text-center" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/orders')}>
          <h3>{stats.delayed_orders || 0}</h3>
          <p>Failed Orders</p>
        </div>
        <div className="card text-center" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/orders')}>
          <h3>₹{stats.total_revenue || 0}</h3>
          <p>Revenue</p>
        </div>
      </div>
    </div>
  );
}

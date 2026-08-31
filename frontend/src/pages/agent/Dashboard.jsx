import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'agent') {
      navigate('/login');
      return;
    }
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders?agent_id=${user.user_id}`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/agents/${user.user_id}/availability`)
      .then(res => res.json())
      .then(data => setIsAvailable(data.available))
      .catch(err => console.error(err));
  }, [navigate, user]);

  const toggleAvailability = async () => {
    const newState = !isAvailable;
    setIsAvailable(newState);
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/agents/${user.user_id}/availability`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: newState })
      });
    } catch (err) {
      console.error(err);
      setIsAvailable(!newState);
    }
  };

  const totalOrders = orders.length;
  const inTransit = orders.filter(o => ['Transit', 'Picked Up', 'Assigned'].includes(o.status)).length;
  const failed = orders.filter(o => ['Failed'].includes(o.status)).length;
  const cancelled = orders.filter(o => o.status === 'Cancelled').length;
  const delivered = orders.filter(o => o.status === 'Delivered').length;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Agent Dashboard</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: 'bold' }}>Status: {isAvailable ? 'Available' : 'Busy'}</span>
          <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
            <input type="checkbox" checked={isAvailable} onChange={toggleAvailability} style={{ opacity: 0, width: 0, height: 0 }} />
            <span style={{
              position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: isAvailable ? '#4caf50' : '#ccc', transition: '.4s', borderRadius: '24px'
            }}>
              <span style={{
                position: 'absolute', height: '18px', width: '18px', left: isAvailable ? '28px' : '3px', bottom: '3px',
                backgroundColor: 'white', transition: '.4s', borderRadius: '50%'
              }}></span>
            </span>
          </label>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
        <div className="card text-center" style={{ cursor: 'pointer' }} onClick={() => navigate('/agent/orders?filter=all')}>
          <h3>{totalOrders}</h3>
          <p>Total Orders</p>
        </div>
        <div className="card text-center" style={{ cursor: 'pointer' }} onClick={() => navigate('/agent/orders?filter=transit')}>
          <h3>{inTransit}</h3>
          <p>Active Tasks</p>
        </div>
        <div className="card text-center" style={{ cursor: 'pointer' }} onClick={() => navigate('/agent/orders?filter=delivered')}>
          <h3>{delivered}</h3>
          <p>Delivered</p>
        </div>
        <div className="card text-center" style={{ cursor: 'pointer' }} onClick={() => navigate('/agent/orders?filter=failed')}>
          <h3>{failed}</h3>
          <p>Failed</p>
        </div>
        <div className="card text-center" style={{ cursor: 'pointer' }} onClick={() => navigate('/agent/orders?filter=cancelled')}>
          <h3>{cancelled}</h3>
          <p>Cancelled</p>
        </div>
      </div>
    </div>
  );
}

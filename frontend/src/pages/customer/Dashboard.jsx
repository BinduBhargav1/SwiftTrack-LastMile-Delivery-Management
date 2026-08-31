import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'customer') {
      navigate('/login');
      return;
    }
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders?customer_id=${user.user_id}`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  }, [navigate, user]);

  const totalOrders = orders.length;
  const inTransit = orders.filter(o => ['Transit', 'Picked Up', 'Assigned', 'Order Placed'].includes(o.status)).length;
  const failed = orders.filter(o => ['Failed', 'Rescheduled'].includes(o.status)).length;
  const cancelled = orders.filter(o => o.status === 'Cancelled').length;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Customer Dashboard</h2>
        <button className="btn" onClick={() => navigate('/customer/create-order')}>Create New Order</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div className="card text-center" style={{ cursor: 'pointer' }} onClick={() => navigate('/customer/orders?filter=all')}>
          <h3>{totalOrders}</h3>
          <p>Total Orders</p>
        </div>
        <div className="card text-center" style={{ cursor: 'pointer' }} onClick={() => navigate('/customer/orders?filter=transit')}>
          <h3>{inTransit}</h3>
          <p>In Progress / Transit</p>
        </div>
        <div className="card text-center" style={{ cursor: 'pointer' }} onClick={() => navigate('/customer/orders?filter=failed')}>
          <h3>{failed}</h3>
          <p>Failed / Rescheduled</p>
        </div>
        <div className="card text-center" style={{ cursor: 'pointer' }} onClick={() => navigate('/customer/orders?filter=cancelled')}>
          <h3>{cancelled}</h3>
          <p>Cancelled</p>
        </div>
      </div>
    </div>
  );
}

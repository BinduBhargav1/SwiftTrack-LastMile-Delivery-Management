import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'agent') {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [navigate, user]);

  const fetchOrders = () => {
    fetch(`http://localhost:5000/api/orders?agent_id=${user.user_id}`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  };

  const updateStatus = async (orderId, status) => {
    try {
      await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, changed_by: user.user_id })
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (filter === 'transit') return ['Transit', 'Picked Up', 'Assigned'].includes(o.status);
    if (filter === 'failed') return ['Failed'].includes(o.status);
    if (filter === 'cancelled') return o.status === 'Cancelled';
    if (filter === 'delivered') return o.status === 'Delivered';
    return true; // 'all'
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Assigned Orders {filter !== 'all' ? `(${filter})` : ''}</h2>
      
      <div className="card mt-4">
        {filteredOrders.length === 0 ? (
          <p>No orders found for this category.</p>
        ) : (
          <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Tracking #</th>
                <th style={{ padding: '0.5rem' }}>Pickup</th>
                <th style={{ padding: '0.5rem' }}>Drop</th>
                <th style={{ padding: '0.5rem' }}>Status</th>
                <th style={{ padding: '0.5rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(o => (
                <tr key={o.order_id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem' }}>{o.tracking_number}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <div>{o.pickup_address}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>{o.pickup_zone_name}</div>
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <div>{o.drop_address}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>{o.drop_zone_name}</div>
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <span className={`status-badge status-${o.status.toLowerCase().replace(' ', '-')}`}>{o.status}</span>
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    {o.status === 'Assigned' && (
                      <>
                        <button className="btn mt-2" onClick={() => updateStatus(o.order_id, 'Picked Up')}>Mark Picked Up</button>
                        <button className="btn btn-outline mt-2" style={{ marginLeft: '0.5rem', color: '#dc3545', borderColor: '#dc3545' }} onClick={() => { if(window.confirm('Are you sure you want to cancel this order?')) updateStatus(o.order_id, 'Cancelled'); }}>Cancel</button>
                      </>
                    )}
                    {o.status === 'Picked Up' && (
                      <button className="btn mt-2" onClick={() => updateStatus(o.order_id, 'Transit')}>Mark Transit</button>
                    )}
                    {o.status === 'Transit' && (
                      <>
                        <button className="btn mt-2" style={{ marginRight: '0.5rem' }} onClick={() => updateStatus(o.order_id, 'Delivered')}>Delivered</button>
                        <button className="btn btn-outline mt-2" onClick={() => updateStatus(o.order_id, 'Failed')}>Failed</button>
                        <button className="btn btn-outline mt-2" style={{ marginLeft: '0.5rem', color: '#dc3545', borderColor: '#dc3545' }} onClick={() => { if(window.confirm('Are you sure you want to cancel this order?')) updateStatus(o.order_id, 'Cancelled'); }}>Cancel</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

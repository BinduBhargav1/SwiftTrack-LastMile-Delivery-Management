import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function TrackOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/${id}`)
      .then(res => res.json())
      .then(data => setOrder(data))
      .catch(err => console.error(err));

    fetch(`http://localhost:5000/api/tracking/${id}`)
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!order) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <button className="btn btn-outline mb-4" onClick={() => navigate(-1)}>Back</button>
      <h2>Tracking: {order.tracking_number}</h2>
      
      <div className="card mt-4">
        <h3>Order Details</h3>
        <p><strong>Status:</strong> <span className={`status-badge status-${order.status.toLowerCase().replace(' ', '-')}`}>{order.status}</span></p>
        <p><strong>From:</strong> {order.pickup_address} ({order.pickup_zone_name})</p>
        <p><strong>To:</strong> {order.drop_address} ({order.drop_zone_name})</p>
        <p><strong>Charge:</strong> ₹{order.delivery_charge} ({order.payment_type})</p>
        {order.agent_name && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Delivery Agent</h4>
            <p style={{ margin: 0 }}><strong>Name:</strong> {order.agent_name}</p>
            <p style={{ margin: 0 }}><strong>Phone:</strong> {order.agent_phone}</p>
          </div>
        )}
      </div>

      <div className="card mt-4">
        <h3>Tracking Timeline</h3>
        <ul style={{ listStyle: 'none', paddingLeft: '1rem', borderLeft: '2px solid var(--primary-color)', marginTop: '1rem' }}>
          {history.map((h, i) => (
            <li key={h.history_id} style={{ position: 'relative', marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
              <div style={{ 
                position: 'absolute', left: '-1.4rem', top: '0.2rem', 
                width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-color)' 
              }}></div>
              <div style={{ fontWeight: 'bold' }}>{h.status}</div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>{new Date(h.changed_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

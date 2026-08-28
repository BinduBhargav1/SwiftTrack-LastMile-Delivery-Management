import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchOrders = () => {
    fetch(`http://localhost:5000/api/orders?customer_id=${user.user_id}`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (!user || user.role !== 'customer') {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [navigate, user]);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchOrders();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to cancel');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusSteps = (currentStatus) => {
    const sequence = ['Order Placed', 'Assigned', 'Picked Up', 'Transit', 'Delivered'];
    if (currentStatus === 'Failed') return <span style={{ color: 'red', fontWeight: 'bold' }}>Failed</span>;
    if (currentStatus === 'Rescheduled') return <span style={{ color: 'orange', fontWeight: 'bold' }}>Rescheduled</span>;
    if (currentStatus === 'Cancelled') return <span style={{ color: 'gray', fontWeight: 'bold' }}>Cancelled</span>;
    
    const currentIndex = sequence.indexOf(currentStatus);
    return (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {sequence.map((step, idx) => (
          <div key={step} title={step} style={{
            width: '12px', height: '12px', borderRadius: '50%',
            backgroundColor: idx <= currentIndex ? 'var(--primary-color)' : '#eee',
            border: idx === currentIndex ? '2px solid #000' : 'none'
          }}></div>
        ))}
        <span style={{ marginLeft: '8px', fontSize: '0.85rem' }}>{currentStatus}</span>
      </div>
    );
  };

  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';

  const filteredOrders = orders.filter(o => {
    if (filter === 'transit') return ['Transit', 'Picked Up', 'Assigned', 'Order Placed'].includes(o.status);
    if (filter === 'failed') return ['Failed', 'Rescheduled'].includes(o.status);
    if (filter === 'cancelled') return o.status === 'Cancelled';
    return true;
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Orders {filter !== 'all' ? `(${filter})` : ''}</h2>
      <div className="card mt-4">
        {filteredOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Tracking #</th>
                <th style={{ padding: '0.5rem' }}>Date</th>
                <th style={{ padding: '0.5rem' }}>Status</th>
                <th style={{ padding: '0.5rem' }}>Charge</th>
                <th style={{ padding: '0.5rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(o => (
                <tr key={o.order_id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem' }}>{o.tracking_number}</td>
                  <td style={{ padding: '0.5rem' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '0.5rem' }}>
                    {getStatusSteps(o.status)}
                  </td>
                  <td style={{ padding: '0.5rem' }}>₹{o.delivery_charge}</td>
                  <td style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => navigate(`/customer/track/${o.order_id}`)}>
                      Track
                    </button>
                    {o.status === 'Order Placed' && (
                      <button className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: '#dc3545', color: 'white', borderColor: '#dc3545' }} onClick={() => handleCancel(o.order_id)}>
                        Cancel
                      </button>
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

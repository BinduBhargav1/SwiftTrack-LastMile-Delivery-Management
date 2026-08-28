import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateOrder() {
  const [zones, setZones] = useState([]);
  const [allPoints, setAllPoints] = useState([]);
  const [formData, setFormData] = useState({
    pickup_address: '', drop_address: '', pickup_zone: '', drop_zone: '',
    length: '', width: '', height: '', actual_weight: '',
    order_type: 'B2C', payment_type: 'Prepaid'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/zones')
      .then(res => res.json())
      .then(data => {
        setZones(data);
        if (data.length > 0) {
          setFormData(f => ({ ...f, pickup_zone: data[0].zone_id, drop_zone: data[0].zone_id }));
        }
      })
      .catch(err => console.error(err));
      
    fetch('http://localhost:5000/api/admin/points')
      .then(res => res.json())
      .then(data => setAllPoints(data))
      .catch(err => console.error(err));
  }, []);

  const pickupPoints = allPoints.filter(p => p.zone_id.toString() === formData.pickup_zone.toString());
  const dropPoints = allPoints.filter(p => p.zone_id.toString() === formData.drop_zone.toString());

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, customer_id: user.user_id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create order');
      
      setSuccess(`Order created! Tracking Number: ${data.tracking_number}. Charge: ₹${data.delivery_charge}`);
      setTimeout(() => navigate('/customer/dashboard'), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Create New Order</h2>
      {error && <div style={{ color: 'red', margin: '1rem 0' }}>{error}</div>}
      {success && <div style={{ color: 'green', margin: '1rem 0', padding: '1rem', background: '#e6ffe6' }}>{success}</div>}
      
      <form onSubmit={handleSubmit} className="card" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="mb-2" style={{ display: 'block' }}>Pickup Zone</label>
            <select name="pickup_zone" value={formData.pickup_zone} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }}>
              {zones.map(z => <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2" style={{ display: 'block' }}>Drop Zone</label>
            <select name="drop_zone" value={formData.drop_zone} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }}>
              {zones.map(z => <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="mb-2" style={{ display: 'block' }}>Pickup Point</label>
            <select name="pickup_address" value={formData.pickup_address} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }} required>
              <option value="">Select a pickup point</option>
              {pickupPoints.map(p => <option key={p.point_id} value={p.point_name}>{p.point_name}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="mb-2" style={{ display: 'block' }}>Drop Point</label>
            <select name="drop_address" value={formData.drop_address} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }} required>
              <option value="">Select a drop point</option>
              {dropPoints.map(p => <option key={p.point_id} value={p.point_name}>{p.point_name}</option>)}
            </select>
          </div>
          
          <div>
            <label className="mb-2" style={{ display: 'block' }}>Dimensions (L x W x H in cm)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="number" name="length" placeholder="L" value={formData.length} onChange={handleChange} style={{ width: '33%', padding: '0.5rem' }} required />
              <input type="number" name="width" placeholder="W" value={formData.width} onChange={handleChange} style={{ width: '33%', padding: '0.5rem' }} required />
              <input type="number" name="height" placeholder="H" value={formData.height} onChange={handleChange} style={{ width: '33%', padding: '0.5rem' }} required />
            </div>
          </div>
          <div>
            <label className="mb-2" style={{ display: 'block' }}>Actual Weight (kg)</label>
            <input type="number" step="0.1" name="actual_weight" value={formData.actual_weight} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }} required />
          </div>

          <div>
            <label className="mb-2" style={{ display: 'block' }}>Order Type</label>
            <select name="order_type" value={formData.order_type} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }}>
              <option value="B2B">B2B</option>
              <option value="B2C">B2C</option>
            </select>
          </div>
          <div>
            <label className="mb-2" style={{ display: 'block' }}>Payment Type</label>
            <select name="payment_type" value={formData.payment_type} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }}>
              <option value="Prepaid">Prepaid</option>
              <option value="COD">COD</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn mt-4">Calculate & Place Order</button>
      </form>
    </div>
  );
}

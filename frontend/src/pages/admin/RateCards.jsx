import React, { useEffect, useState } from 'react';

export default function RateCards() {
  const [rates, setRates] = useState([]);
  const [zones, setZones] = useState([]);
  const [formData, setFormData] = useState({ from_zone: '', to_zone: '', order_type: 'B2B', rate_per_kg: '', cod_surcharge: '0' });

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/rates`)
      .then(res => res.json())
      .then(data => setRates(data));
      
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/zones`)
      .then(res => res.json())
      .then(data => setZones(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/rates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setFormData({ from_zone: '', to_zone: '', order_type: 'B2B', rate_per_kg: '', cod_surcharge: '0' });
    fetchData();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Manage Rate Cards</h2>
      <div className="card mt-4 mb-4" style={{ maxWidth: '600px' }}>
        <h3>Add New Rate Card</h3>
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>From Zone</label>
            <select className="form-control" value={formData.from_zone} onChange={e => setFormData({...formData, from_zone: e.target.value})} required>
              <option value="">Select zone</option>
              {zones.map(z => <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>To Zone</label>
            <select className="form-control" value={formData.to_zone} onChange={e => setFormData({...formData, to_zone: e.target.value})} required>
              <option value="">Select zone</option>
              {zones.map(z => <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Order Type</label>
            <select className="form-control" value={formData.order_type} onChange={e => setFormData({...formData, order_type: e.target.value})}>
              <option value="B2B">B2B</option>
              <option value="B2C">B2C</option>
            </select>
          </div>
          <div className="form-group">
            <label>Rate per Kg (₹)</label>
            <input type="number" className="form-control" value={formData.rate_per_kg} onChange={e => setFormData({...formData, rate_per_kg: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>COD Surcharge (₹)</label>
            <input type="number" className="form-control" value={formData.cod_surcharge} onChange={e => setFormData({...formData, cod_surcharge: e.target.value})} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="btn mt-2">Create Rate Card</button>
          </div>
        </form>
      </div>

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>From</th>
              <th style={{ padding: '0.5rem' }}>To</th>
              <th style={{ padding: '0.5rem' }}>Type</th>
              <th style={{ padding: '0.5rem' }}>Rate/Kg</th>
              <th style={{ padding: '0.5rem' }}>COD Surcharge</th>
            </tr>
          </thead>
          <tbody>
            {rates.map(r => (
              <tr key={r.rate_id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{r.from_zone_name}</td>
                <td style={{ padding: '0.5rem' }}>{r.to_zone_name}</td>
                <td style={{ padding: '0.5rem' }}>{r.order_type}</td>
                <td style={{ padding: '0.5rem' }}>₹{r.rate_per_kg}</td>
                <td style={{ padding: '0.5rem' }}>₹{r.cod_surcharge}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

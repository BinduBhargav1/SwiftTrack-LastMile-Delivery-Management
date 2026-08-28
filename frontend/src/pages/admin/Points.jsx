import React, { useEffect, useState } from 'react';

export default function Points() {
  const [points, setPoints] = useState([]);
  const [zones, setZones] = useState([]);
  const [formData, setFormData] = useState({ zone_id: '', point_name: '' });

  const fetchData = () => {
    fetch('http://localhost:5000/api/admin/points')
      .then(res => res.json())
      .then(data => setPoints(data));
      
    fetch('http://localhost:5000/api/admin/zones')
      .then(res => res.json())
      .then(data => setZones(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/admin/points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setFormData({ zone_id: '', point_name: '' });
    fetchData();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Manage Pickup/Drop Points</h2>
      <div className="card mt-4 mb-4" style={{ maxWidth: '500px' }}>
        <h3>Add New Point</h3>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Zone</label>
            <select className="form-control" value={formData.zone_id} onChange={e => setFormData({...formData, zone_id: e.target.value})} required>
              <option value="">Select a zone</option>
              {zones.map(z => <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Point Name</label>
            <input type="text" className="form-control" value={formData.point_name} onChange={e => setFormData({...formData, point_name: e.target.value})} required />
          </div>
          <button type="submit" className="btn mt-2">Create Point</button>
        </form>
      </div>

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>ID</th>
              <th style={{ padding: '0.5rem' }}>Zone</th>
              <th style={{ padding: '0.5rem' }}>Point Name</th>
            </tr>
          </thead>
          <tbody>
            {points.map(p => (
              <tr key={p.point_id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{p.point_id}</td>
                <td style={{ padding: '0.5rem' }}>{p.zone_name}</td>
                <td style={{ padding: '0.5rem' }}>{p.point_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

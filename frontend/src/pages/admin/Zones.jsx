import React, { useEffect, useState } from 'react';

export default function Zones() {
  const [zones, setZones] = useState([]);
  const [newZone, setNewZone] = useState('');

  const fetchZones = () => {
    fetch('http://localhost:5000/api/admin/zones')
      .then(res => res.json())
      .then(data => setZones(data));
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newZone) return;
    await fetch('http://localhost:5000/api/admin/zones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zone_name: newZone })
    });
    setNewZone('');
    fetchZones();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Manage Zones</h2>
      <div className="card mt-4 mb-4" style={{ maxWidth: '400px' }}>
        <h3>Add New Zone</h3>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Zone Name</label>
            <input type="text" className="form-control" value={newZone} onChange={e => setNewZone(e.target.value)} required />
          </div>
          <button type="submit" className="btn mt-2">Create Zone</button>
        </form>
      </div>

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>ID</th>
              <th style={{ padding: '0.5rem' }}>Zone Name</th>
            </tr>
          </thead>
          <tbody>
            {zones.map(z => (
              <tr key={z.zone_id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{z.zone_id}</td>
                <td style={{ padding: '0.5rem' }}>{z.zone_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

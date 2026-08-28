import React, { useEffect, useState } from 'react';

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [pendingAgents, setPendingAgents] = useState([]);
  const [zones, setZones] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', zone_id: '' });
  const [approvalZones, setApprovalZones] = useState({});

  const fetchData = () => {
    fetch('http://localhost:5000/api/admin/agents')
      .then(res => res.json())
      .then(data => setAgents(data));
      
    fetch('http://localhost:5000/api/admin/agents/pending')
      .then(res => res.json())
      .then(data => setPendingAgents(data));
      
    fetch('http://localhost:5000/api/admin/zones')
      .then(res => res.json())
      .then(data => setZones(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/admin/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setFormData({ name: '', email: '', phone: '', password: '', zone_id: '' });
    fetchData();
  };

  const handleApprove = async (userId) => {
    const zoneId = approvalZones[userId];
    if (!zoneId) return alert('Please select a zone to assign');
    await fetch('http://localhost:5000/api/admin/agents/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, zone_id: zoneId })
    });
    fetchData();
  };

  const handleReject = async (userId) => {
    if (!confirm('Are you sure you want to reject this registration?')) return;
    await fetch(`http://localhost:5000/api/admin/agents/reject/${userId}`, { method: 'DELETE' });
    fetchData();
  };

  const handleDelete = async (agentId) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;
    const res = await fetch(`http://localhost:5000/api/admin/agents/${agentId}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) alert(data.error);
    fetchData();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Manage Agents</h2>
      <div className="card mt-4 mb-4" style={{ maxWidth: '500px' }}>
        <h3>Add New Agent</h3>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" className="form-control" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password (default 123456)</label>
            <input type="text" className="form-control" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Zone</label>
            <select className="form-control" value={formData.zone_id} onChange={e => setFormData({...formData, zone_id: e.target.value})} required>
              <option value="">Select a zone</option>
              {zones.map(z => <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>)}
            </select>
          </div>
          <button type="submit" className="btn mt-2">Create Agent</button>
        </form>
      </div>

      {pendingAgents.length > 0 && (
        <div className="card mb-4" style={{ border: '2px solid orange' }}>
          <h3 style={{ color: 'orange' }}>Pending Agent Approvals</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Name</th>
                <th style={{ padding: '0.5rem' }}>Email</th>
                <th style={{ padding: '0.5rem' }}>Phone</th>
                <th style={{ padding: '0.5rem' }}>Assign Zone</th>
                <th style={{ padding: '0.5rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingAgents.map(p => (
                <tr key={p.user_id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem' }}>{p.name}</td>
                  <td style={{ padding: '0.5rem' }}>{p.email}</td>
                  <td style={{ padding: '0.5rem' }}>{p.phone}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <select className="form-control" onChange={e => setApprovalZones({...approvalZones, [p.user_id]: e.target.value})} style={{ width: '150px' }}>
                      <option value="">Select Zone</option>
                      {zones.map(z => <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <button className="btn" style={{ marginRight: '0.5rem', background: '#28a745' }} onClick={() => handleApprove(p.user_id)}>Approve</button>
                    <button className="btn" style={{ background: '#dc3545' }} onClick={() => handleReject(p.user_id)}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Name</th>
              <th style={{ padding: '0.5rem' }}>Email</th>
              <th style={{ padding: '0.5rem' }}>Phone</th>
              <th style={{ padding: '0.5rem' }}>Zone</th>
              <th style={{ padding: '0.5rem' }}>Status</th>
              <th style={{ padding: '0.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map(a => (
              <tr key={a.agent_id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{a.name}</td>
                <td style={{ padding: '0.5rem' }}>{a.email}</td>
                <td style={{ padding: '0.5rem' }}>{a.phone}</td>
                <td style={{ padding: '0.5rem' }}>{a.zone_name}</td>
                <td style={{ padding: '0.5rem' }}>{a.available ? 'Available' : 'Busy'}</td>
                <td style={{ padding: '0.5rem' }}>
                  <button className="btn" style={{ background: '#dc3545', padding: '0.3rem 0.6rem', fontSize: '0.9rem' }} onClick={() => handleDelete(a.agent_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

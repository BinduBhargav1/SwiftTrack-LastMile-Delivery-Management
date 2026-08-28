import React, { useEffect, useState } from 'react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState({});

  const fetchData = () => {
    fetch('http://localhost:5000/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data));
      
    fetch('http://localhost:5000/api/admin/agents')
      .then(res => res.json())
      .then(data => {
        const availableAgents = data.filter(a => a.available === 1);
        setAgents(availableAgents);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = (orderId) => {
    const agentId = selectedAgents[orderId];
    if (!agentId) return alert('Select an agent first');
    
    fetch('http://localhost:5000/api/agents/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, agent_id: agentId })
    }).then(() => fetchData());
  };

  const handleAgentSelect = (orderId, val) => {
    setSelectedAgents(prev => ({ ...prev, [orderId]: val }));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>All Orders</h2>
      <div className="card mt-4">
        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Tracking #</th>
              <th style={{ padding: '0.5rem' }}>Customer ID</th>
              <th style={{ padding: '0.5rem' }}>Zone</th>
              <th style={{ padding: '0.5rem' }}>Agent ID</th>
              <th style={{ padding: '0.5rem' }}>Status</th>
              <th style={{ padding: '0.5rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.order_id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{o.tracking_number}</td>
                <td style={{ padding: '0.5rem' }}>{o.customer_id}</td>
                <td style={{ padding: '0.5rem' }}>{o.pickup_zone_name}</td>
                <td style={{ padding: '0.5rem' }}>{o.agent_name ? `${o.agent_name} (ID: ${o.agent_id})` : 'Unassigned'}</td>
                <td style={{ padding: '0.5rem' }}>
                  <span className={`status-badge status-${o.status.toLowerCase().replace(' ', '-')}`}>{o.status}</span>
                </td>
                <td style={{ padding: '0.5rem' }}>
                  {['Order Placed', 'Assigned', 'Picked Up', 'Transit', 'Rescheduled'].includes(o.status) && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <select onChange={(e) => handleAgentSelect(o.order_id, e.target.value)} value={selectedAgents[o.order_id] || ''}>
                        <option value="">Select Agent</option>
                        {agents.map(a => (
                          <option key={a.agent_id} value={a.agent_id}>{a.name} ({a.zone_name})</option>
                        ))}
                      </select>
                      <button className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: o.agent_id ? '#17a2b8' : '' }} onClick={() => handleAssign(o.order_id)}>
                        {o.agent_id ? 'Reassign' : 'Assign'}
                      </button>
                    </div>
                  )}
                  {o.status === 'Failed' && (
                    <button className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => {
                      fetch(`http://localhost:5000/api/orders/${o.order_id}/reschedule`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ reschedule_date: new Date().toISOString() })
                      }).then(() => fetchData());
                    }}>Reschedule</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

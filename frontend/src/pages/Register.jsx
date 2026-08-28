import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      
      if (role === 'agent') {
        setSuccess('Registration successful! Please wait for admin approval before logging in.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/customer/dashboard');
      }
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 className="mb-4">Register</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}
      <form onSubmit={handleRegister}>
        <div className="mb-4">
          <label className="mb-2" style={{ display: 'block' }}>Name</label>
          <input type="text" style={{ width: '100%', padding: '0.5rem' }} value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="mb-2" style={{ display: 'block' }}>Email</label>
          <input type="email" style={{ width: '100%', padding: '0.5rem' }} value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="mb-2" style={{ display: 'block' }}>Phone</label>
          <input type="text" style={{ width: '100%', padding: '0.5rem' }} value={phone} onChange={e => setPhone(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="mb-2" style={{ display: 'block' }}>Password</label>
          <input type="password" style={{ width: '100%', padding: '0.5rem' }} value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="mb-2" style={{ display: 'block' }}>Register As</label>
          <select style={{ width: '100%', padding: '0.5rem' }} value={role} onChange={e => setRole(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="agent">Delivery Agent</option>
          </select>
        </div>
        <button type="submit" className="btn" style={{ width: '100%' }}>Register</button>
      </form>
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

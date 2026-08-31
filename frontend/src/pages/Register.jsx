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
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
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
    <div className="card" style={{ maxWidth: '450px', margin: '4rem auto' }}>
      <h2 className="mb-4 text-center">Register</h2>
      {error && <div style={{ color: 'var(--status-failed)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      {success && <div style={{ color: 'var(--status-delivered)', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="text" className="form-control" value={phone} onChange={e => setPhone(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Register As</label>
          <select className="form-control" value={role} onChange={e => setRole(e.target.value)} style={{ appearance: 'none' }}>
            <option value="customer" style={{ color: '#000' }}>Customer</option>
            <option value="agent" style={{ color: '#000' }}>Delivery Agent</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Register</button>
      </form>
      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
        <span className="text-muted">Already have an account?</span> <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

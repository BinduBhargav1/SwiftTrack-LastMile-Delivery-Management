import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      localStorage.setItem('user', JSON.stringify(data));
      if (onLogin) onLogin(data);
      
      if (data.role === 'customer') navigate('/customer/dashboard');
      else if (data.role === 'agent') navigate('/agent/dashboard');
      else if (data.role === 'admin') navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 className="mb-4">Login</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="mb-2" style={{ display: 'block' }}>Email</label>
          <input type="email" style={{ width: '100%', padding: '0.5rem' }} value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="mb-2" style={{ display: 'block' }}>Password</label>
          <input type="password" style={{ width: '100%', padding: '0.5rem' }} value={password} onChange={e => setPassword(e.target.value)} required />
          <div style={{ textAlign: 'right', marginTop: '0.5rem', fontSize: '0.85rem' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your email!'); }}>Forgot Password?</a>
          </div>
        </div>
        <button type="submit" className="btn" style={{ width: '100%' }}>Login</button>
      </form>
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

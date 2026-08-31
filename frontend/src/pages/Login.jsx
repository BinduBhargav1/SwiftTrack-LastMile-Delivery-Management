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
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
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
    <div className="card" style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <h2 className="mb-4 text-center">Login</h2>
      {error && <div style={{ color: 'var(--status-failed)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
          <div style={{ textAlign: 'right', marginTop: '0.5rem', fontSize: '0.85rem' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your email!'); }}>Forgot Password?</a>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Login</button>
      </form>
      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
        <span className="text-muted">Don't have an account?</span> <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

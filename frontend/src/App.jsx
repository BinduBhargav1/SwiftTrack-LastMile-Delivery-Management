import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';

import CustomerDashboard from './pages/customer/Dashboard';
import CreateOrder from './pages/customer/CreateOrder';
import CustomerOrders from './pages/customer/Orders';
import TrackOrder from './pages/customer/TrackOrder';

import AgentDashboard from './pages/agent/Dashboard';
import AgentOrders from './pages/agent/Orders';
import AgentOrderDetails from './pages/agent/OrderDetails';

import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminAgents from './pages/admin/Agents';
import AdminZones from './pages/admin/Zones';
import AdminRateCards from './pages/admin/RateCards';
import AdminPoints from './pages/admin/Points';

function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setRole(user.role);
    }
  }, []);

  const handleLogin = (user) => {
    setRole(user.role);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setRole(null);
  };

  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/'].includes(location.pathname);

  return (
    <>
      <Navbar onLogout={handleLogout} />
      <div style={{ display: 'flex' }}>
        {!isAuthPage && role && <Sidebar role={role} onLogout={handleLogout} />}
        <main style={{ flex: 1, padding: '1rem', minHeight: 'calc(100vh - 64px)' }}>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route path="/" element={<Navigate to="/login" />} />
            
            {/* Customer */}
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/create-order" element={<CreateOrder />} />
            <Route path="/customer/orders" element={<CustomerOrders />} />
            <Route path="/customer/track/:id" element={<TrackOrder />} />
            
            {/* Agent */}
            <Route path="/agent/dashboard" element={<AgentDashboard />} />
            <Route path="/agent/orders" element={<AgentOrders />} />
            <Route path="/agent/order/:id" element={<AgentOrderDetails />} />
            
            {/* Admin */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/agents" element={<AdminAgents />} />
            <Route path="/admin/zones" element={<AdminZones />} />
            <Route path="/admin/points" element={<AdminPoints />} />
            <Route path="/admin/rate-cards" element={<AdminRateCards />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;

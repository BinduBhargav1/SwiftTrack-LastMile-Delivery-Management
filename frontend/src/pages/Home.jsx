import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [deliveriesCount, setDeliveriesCount] = useState(0);
  const [zonesCount, setZonesCount] = useState(0);

  useEffect(() => {
    // Fetch total orders (deliveries)
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard`)
      .then(res => res.json())
      .then(data => setDeliveriesCount(data.total_orders || 0))
      .catch(err => console.error("Error fetching deliveries:", err));

    // Fetch unique zones
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/zones`)
      .then(res => res.json())
      .then(data => setZonesCount(data.length || 0))
      .catch(err => console.error("Error fetching zones:", err));
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      
      {/* Curved decorative background lines */}
      <div className="decorative-lines"></div>

      {/* Hero Section */}
      <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', zIndex: 1, padding: '0 2rem' }}>
          <h1 style={{ fontSize: '4.5rem', fontWeight: '400', lineHeight: '1.1', marginBottom: '1.5rem', letterSpacing: '-1.5px' }}>
            <span style={{ color: 'var(--text-highlight)' }}>&#125;</span> SwiftTrack<br />
            Is a Premier <span style={{ fontWeight: '600' }}>Last-Mile</span><br />
            Infrastructure Pr<span style={{ position: 'relative', display: 'inline-block' }}>o<span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '24px', height: '12px', border: '1px solid var(--text-highlight)', borderRadius: '50%' }}></span></span>vider
          </h1>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem', paddingRight: '2rem' }}>
            <p style={{ maxWidth: '300px', fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'left', lineHeight: '1.6' }}>
              Renowned for powering the backbone of delivery ecosystems with our state-of-the-art tracking, agent endpoints & route relays.
            </p>
          </div>

          <div>
            <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 3rem', letterSpacing: '2px' }}>GET IN TOUCH</Link>
          </div>
        </div>

        {/* Floating Stat Cards */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '5rem', zIndex: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          
          <div className="card" style={{ padding: '2.5rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '3.5rem', color: 'var(--text-highlight)', fontWeight: '500', lineHeight: '1' }}>
              {deliveriesCount > 0 ? deliveriesCount : '...'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Deliveries under management</p>
          </div>

          <div className="card" style={{ padding: '2.5rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h2 style={{ fontSize: '4rem', color: 'var(--text-main)', fontWeight: '500', lineHeight: '1' }}>
              {zonesCount > 0 ? zonesCount : '...'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Unique service zones</p>
          </div>
          
          <div className="card" style={{ padding: '2.5rem 2rem', display: 'flex', alignItems: 'flex-end' }}>
            {/* Mock avatars */}
            <div style={{ display: 'flex', gap: '10px' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)', border: '2px solid var(--bg-card-dark)' }}></div>
               <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, #f59e0b, #ef4444)', border: '2px solid var(--bg-card-dark)', marginLeft: '-15px' }}></div>
               <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, #10b981, #3b82f6)', border: '2px solid var(--bg-card-dark)', marginLeft: '-15px' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Sections */}
      <section id="services" style={{ minHeight: '80vh', padding: '6rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
         <h2 style={{ fontSize: '3rem', fontWeight: '500', marginBottom: '2rem' }}>Our Services</h2>
         <div className="card" style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
            <p className="text-muted">We provide end-to-end logistics solutions, real-time agent tracking, and dynamic rate calculation based on geospatial zones.</p>
         </div>
      </section>

      <section id="team" style={{ minHeight: '80vh', padding: '6rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
         <h2 style={{ fontSize: '3rem', fontWeight: '500', marginBottom: '2rem' }}>The Team</h2>
         <div className="card" style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
            <p className="text-muted">Built by industry experts committed to revolutionizing last-mile delivery infrastructure.</p>
         </div>
      </section>

      <section id="networks" style={{ minHeight: '80vh', padding: '6rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
         <h2 style={{ fontSize: '3rem', fontWeight: '500', marginBottom: '2rem' }}>Our Networks</h2>
         <div className="card" style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
            <p className="text-muted">Serving over 34 unique zones with hyper-local delivery optimization.</p>
         </div>
      </section>

      <section id="support" style={{ minHeight: '80vh', padding: '6rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
         <h2 style={{ fontSize: '3rem', fontWeight: '500', marginBottom: '2rem' }}>Support</h2>
         <div className="card" style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
            <p className="text-muted">24/7 dedicated support for vendors, dispatchers, and customers tracking their orders.</p>
         </div>
      </section>

    </div>
  );
}

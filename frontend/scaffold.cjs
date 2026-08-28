const fs = require('fs');
const path = require('path');
const dirs = ['components', 'pages/customer', 'pages/agent', 'pages/admin'];
dirs.forEach(d => fs.mkdirSync(path.join('d:/LastMile/frontend/src', d), {recursive: true}));

const pages = [
  'pages/Home.jsx', 'pages/Login.jsx', 'pages/Register.jsx',
  'pages/customer/Dashboard.jsx', 'pages/customer/CreateOrder.jsx', 'pages/customer/Orders.jsx', 'pages/customer/TrackOrder.jsx',
  'pages/agent/Dashboard.jsx', 'pages/agent/OrderDetails.jsx',
  'pages/admin/Dashboard.jsx', 'pages/admin/Orders.jsx', 'pages/admin/Agents.jsx', 'pages/admin/Zones.jsx', 'pages/admin/RateCards.jsx'
];

pages.forEach(p => {
  const name = path.basename(p, '.jsx');
  fs.writeFileSync(path.join('d:/LastMile/frontend/src', p), 
    `import React from 'react';\n\nexport default function ${name}() {\n  return <div>${name} Page</div>;\n}\n`
  );
});

console.log('Pages scaffolded');

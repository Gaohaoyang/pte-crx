// import React from 'react';
import ReactDOM from 'react-dom/client';
import './content.css';
import ContentUI from './ContentUI';

const root = document.createElement('div');
root.id = 'crx-root';
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  // <React.StrictMode>
  <ContentUI />,
  // </React.StrictMode>,
);

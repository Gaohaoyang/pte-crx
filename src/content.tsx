import React from 'react';
import ReactDOM from 'react-dom/client';
import './content.css';
import App from './App';

const root = document.createElement('div');
root.id = 'crx-root';
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// import React from 'react';
import ReactDOM from 'react-dom/client';
import './content.css';
import ContentUI from './ContentUI';

const root = document.createElement('div');
root.id = 'crx-root';
document.body.appendChild(root);

// const ContentUI = () => {
//   return <div className="absolute top-1 right-0 w-96 h-96 bg-red-500 z-50">hi</div>;
// };

ReactDOM.createRoot(root).render(
  // <React.StrictMode>
  <ContentUI />,
  // </React.StrictMode>,
);


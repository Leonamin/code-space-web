import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n/config';  // i18n 설정을 import
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

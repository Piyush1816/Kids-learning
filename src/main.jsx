import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Synchronously apply accessibility and theme classes on html before mounting to avoid flash
if (typeof window !== 'undefined') {
  // 1. Dark Mode
  const savedDark = localStorage.getItem('ll_dark_mode');
  if (savedDark === 'true' || (savedDark === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // 2. Reduced Motion
  const savedMotion = localStorage.getItem('ll_reduced_motion');
  if (savedMotion === 'true' || (savedMotion === null && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    document.documentElement.classList.add('reduced-motion');
    document.documentElement.classList.remove('motion-allowed');
  } else {
    document.documentElement.classList.remove('reduced-motion');
    document.documentElement.classList.add('motion-allowed');
  }

  // 3. High Contrast Text
  const savedContrast = localStorage.getItem('ll_high_contrast');
  if (savedContrast === 'true') {
    document.documentElement.classList.add('high-contrast');
  } else {
    document.documentElement.classList.remove('high-contrast');
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

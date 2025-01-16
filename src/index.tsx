// src/index.tsx

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// Importa Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';

const Loader = () => (
  <div className="loader">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <circle fill="#FF156D" stroke="#FF156D" strokeWidth="15" r="15" cx="40" cy="65">
        <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
      </circle>
      <circle fill="#FF156D" stroke="#FF156D" strokeWidth="15" r="15" cx="100" cy="65">
        <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
      </circle>
      <circle fill="#FF156D" stroke="#FF156D" strokeWidth="15" r="15" cx="160" cy="65">
        <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
      </circle>
    </svg>
  </div>
);

const AppWithLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return loading ? <Loader /> : <App />;
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
      <AuthProvider>
      <CartProvider>
    <AppWithLoader />
    </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);

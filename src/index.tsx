// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// Importa Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
      <AuthProvider>
      <CartProvider>
    <App />
    </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);

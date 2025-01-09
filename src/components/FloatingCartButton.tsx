// src/components/FloatingCartButton.tsx

import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

import './FloatingCartButton.css';

interface FloatingCartButtonProps {
  onClick: () => void;
  totalPrice: number;
  cartCount: number;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({
  onClick,
  totalPrice,
  cartCount,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        cursor: 'pointer',
        zIndex: 999,
      }}
      onClick={onClick}
    >
      {/* Aquí el círculo verde con el ícono */}
      <div
        className={
          // Aplica la clase "heartbeat" solo si hay productos en el carrito
          cartCount > 0 ? 'cart-icon heartbeat' : 'cart-icon'
        }
        style={{
          backgroundColor: 'green',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: '10px',
        }}
      >
        <FaShoppingCart size={24} color="#fff" />
      </div>
      
      {/* Debajo, el total */}
      <div
        style={{
         
          backgroundColor: 'orange',
          borderRadius: '20px',
          textAlign: 'center',
          color: '#fff',
          padding: '10px',
       
        }}
      >
        ${totalPrice}
      </div>
    </div>
  );
};

export default FloatingCartButton;

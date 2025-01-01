// src/components/FloatingCartButton.tsx

import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

interface FloatingCartButtonProps {
  onClick: () => void;
  totalPrice: number;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ onClick, totalPrice }) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        cursor: 'pointer',
        zIndex: 9999,
      }}
      onClick={onClick}
    >
      <div
        style={{
          backgroundColor: 'green',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FaShoppingCart size={24} color="#fff" />
      </div>
      <div
        style={{
          marginTop: '5px',
          backgroundColor: 'orange',
          borderRadius: '20px',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        ${totalPrice}
      </div>
    </div>
  );
};

export default FloatingCartButton;

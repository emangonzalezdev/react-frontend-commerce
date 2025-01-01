// src/components/Banner.tsx

import React from 'react';
import './Banner.css'; // opcional para estilos propios

interface BannerProps {
  bannerImage?: string;
  storeType?: string;
  isOpen?: boolean;
}

const Banner: React.FC<BannerProps> = ({
  bannerImage = 'https://via.placeholder.com/1200x300', // imagen por defecto
  storeType = 'Componentes electrónicos',
  isOpen = true,
}) => {
  return (
    <div
      className="banner-container"
      style={{
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        height: '300px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          gap: '10px',
        }}
      >
        <button
          className="btn btn-sm"
          style={{
            backgroundColor: 'blue',
            color: 'white',
            borderRadius: '20px',
          }}
        >
          {storeType}
        </button>
        <button
          className="btn btn-sm"
          style={{
            backgroundColor: isOpen ? 'green' : 'blue',
            color: 'white',
            borderRadius: '20px',
          }}
        >
          {isOpen ? 'Abierto' : 'Cerrado'}
        </button>
      </div>
    </div>
  );
};

export default Banner;

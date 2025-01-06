// src/components/Banner.tsx

import React, { useEffect, useState } from 'react';

interface BannerImage {
  url: string;
  link?: string; // link opcional
}

interface BannerProps {
  bannerImages: BannerImage[];
  interval: number; // en segundos
  storeType: string;
  // isOpen?: boolean (puedes añadir si lo quieres)
}

const Banner: React.FC<BannerProps> = ({
  bannerImages,
  interval,
  storeType,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (bannerImages.length > 1) {
      const timer = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % bannerImages.length);
      }, interval * 1000);

      return () => clearInterval(timer);
    }
  }, [bannerImages, interval]);

  if (!bannerImages || bannerImages.length === 0) {
    // fallback si no hay imágenes
    return (
      <div
        style={{
          height: '300px',
          backgroundColor: '#ccc',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >

      </div>
    );
  }

  const currentImage = bannerImages[activeIndex];

  const handleBannerClick = () => {
    if (currentImage.link) {
      window.open(currentImage.link, '_blank');
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        height: '300px',
        backgroundImage: `url(${currentImage.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        cursor: currentImage.link ? 'pointer' : 'default',
      }}
      onClick={handleBannerClick}
    >
      {/* Ejemplo: storeType en un botón */}
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
          {storeType || 'Tipo de tienda'}
        </button>
      </div>
    </div>
  );
};

export default Banner;

// src/components/AvatarSection.tsx

import React from 'react';
import { FaWhatsapp, FaPhone, FaShareAlt } from 'react-icons/fa';

interface AvatarSectionProps {
  avatarUrl?: string;
  storeName?: string;
  storeSubtitle?: string;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({
  avatarUrl = 'https://via.placeholder.com/150',
  storeName = 'Mi Tienda',
  storeSubtitle = 'Subtítulo o descripción',
}) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: '¡Mira esta tienda!',
        url: window.location.href,
      })
      .then(() => console.log('Compartido con éxito'))
      .catch((err) => console.error('Error al compartir:', err));
    } else {
      alert('Compartir no soportado. Copia la URL: ' + window.location.href);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-auto">
          <div className="d-flex align-items-center p-3">
            <img
              src={avatarUrl}
              alt="Avatar"
              style={{ width: '80px', height: '80px', borderRadius: '50%' }}
            />
            <div className="ms-3">
              <h4>{storeName}</h4>
              <p>{storeSubtitle}</p>
              <div className="d-flex gap-2 mt-2">
                <button className="btn btn-success btn-sm">
                  <FaWhatsapp /> WhatsApp
                </button>
                <button className="btn btn-primary btn-sm">
                  <FaPhone /> Llamada
                </button>
                <button className="btn btn-secondary btn-sm" onClick={handleShare}>
                  <FaShareAlt /> Compartir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarSection;

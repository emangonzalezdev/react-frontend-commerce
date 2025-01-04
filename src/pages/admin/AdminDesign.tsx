// src/pages/admin/AdminDesign.tsx
import React, { useEffect, useState } from 'react';
import { db } from '../../services/firebaseConfig.ts';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface BannerImage {
  url: string;
}

interface DesignConfig {
  bannerImages: BannerImage[];
  bannerInterval: number; // segundos
  backgroundImage?: string;
}

const AdminDesign: React.FC = () => {
  const [designConfig, setDesignConfig] = useState<DesignConfig>({
    bannerImages: [],
    bannerInterval: 5,
    backgroundImage: '',
  });

  useEffect(() => {
    fetchDesignConfig();
  }, []);

  const fetchDesignConfig = async () => {
    try {
      const docRef = doc(db, 'storeInfo', 'designConfig');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as DesignConfig;
        setDesignConfig(data);
      }
    } catch (error) {
      console.error('Error fetching design config:', error);
    }
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'storeInfo', 'designConfig');
      await setDoc(docRef, designConfig);
      alert('Diseño guardado');
    } catch (error) {
      console.error('Error saving design config:', error);
    }
  };

  return (
    <div className="p-3">
      <h2>Diseño del sitio</h2>

      <div className="mb-3">
        <label>Imágenes del banner rotatorio</label>
        {designConfig.bannerImages.map((img, idx) => (
          <div key={idx} className="d-flex gap-2 mb-2">
            <input
              className="form-control"
              placeholder="URL de la imagen"
              value={img.url}
              onChange={(e) => {
                const newArr = [...designConfig.bannerImages];
                newArr[idx].url = e.target.value;
                setDesignConfig({ ...designConfig, bannerImages: newArr });
              }}
            />
            <button
              className="btn btn-danger"
              onClick={() => {
                const newArr = [...designConfig.bannerImages];
                newArr.splice(idx, 1);
                setDesignConfig({ ...designConfig, bannerImages: newArr });
              }}
            >
              X
            </button>
          </div>
        ))}
        <button
          className="btn btn-secondary"
          onClick={() => {
            const newArr = [...designConfig.bannerImages, { url: '' }];
            setDesignConfig({ ...designConfig, bannerImages: newArr });
          }}
        >
          + Agregar imagen
        </button>
      </div>

      <div className="mb-3">
        <label>Segundos de transición</label>
        <input
          type="number"
          className="form-control"
          value={designConfig.bannerInterval}
          onChange={(e) =>
            setDesignConfig({ ...designConfig, bannerInterval: Number(e.target.value) })
          }
        />
      </div>

      <div className="mb-3">
        <label>Fondo del sitio (URL)</label>
        <input
          className="form-control"
          value={designConfig.backgroundImage}
          onChange={(e) =>
            setDesignConfig({ ...designConfig, backgroundImage: e.target.value })
          }
        />
      </div>

      <button className="btn btn-primary" onClick={handleSave}>
        Guardar diseño
      </button>
    </div>
  );
};

export default AdminDesign;

// src/pages/admin/AdminStoreInfo.tsx
import React, { useEffect, useState } from 'react';
import { db } from '../../services/firebaseConfig.ts';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface StoreInfo {
  storeName: string;
  subtitle: string;
  seoDescription: string;
  storeType: string;
  schedule: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  logoURL?: string;
  avatarURL?: string;
  whatsapp?: string;
  phone?: string;
  socialLinks?: { label: string; url: string }[];
}

const AdminStoreInfo: React.FC = () => {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    storeName: '',
    subtitle: '',
    seoDescription: '',
    storeType: '',
    schedule: {
      monday: { open: '', close: '' },
      tuesday: { open: '', close: '' },
      wednesday: { open: '', close: '' },
      thursday: { open: '', close: '' },
      friday: { open: '', close: '' },
      saturday: { open: '', close: '' },
      sunday: { open: '', close: '' }
    },
    logoURL: '',
    avatarURL: '',
    whatsapp: '',
    phone: '',
    socialLinks: [],
  });

  // Cargamos la info al montar
  useEffect(() => {
    fetchStoreInfo();
  }, []);

  const fetchStoreInfo = async () => {
    try {
      const docRef = doc(db, 'storeInfo', 'main');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        // Manejar datos parciales
        const data = snap.data() as Partial<StoreInfo>;

        // Definir estructura por defecto para el horario
        const defaultSchedule = {
          monday: { open: '', close: '' },
          tuesday: { open: '', close: '' },
          wednesday: { open: '', close: '' },
          thursday: { open: '', close: '' },
          friday: { open: '', close: '' },
          saturday: { open: '', close: '' },
          sunday: { open: '', close: '' },
        };

        // Combinar datos existentes con valores por defecto
        setStoreInfo({
          storeName: data.storeName ?? '',
          subtitle: data.subtitle ?? '',
          seoDescription: data.seoDescription ?? '',
          storeType: data.storeType ?? '',
          schedule: data.schedule ?? defaultSchedule,
          logoURL: data.logoURL ?? '',
          avatarURL: data.avatarURL ?? '',
          whatsapp: data.whatsapp ?? '',
          phone: data.phone ?? '',
          socialLinks: data.socialLinks ?? [],
        });
      }
    } catch (error) {
      console.error('Error fetching store info:', error);
    }
  };

  const handleSave = async () => {
    try {
      // Guardamos/actualizamos el doc
      const docRef = doc(db, 'storeInfo', 'main');
      await setDoc(docRef, storeInfo);
      alert('Datos de la tienda guardados!');
    } catch (error) {
      console.error('Error saving store info:', error);
    }
  };

  return (
    <div className="p-3">
      <h2>Datos de mi tienda</h2>
      
      <div className="mb-3">
        <label>Nombre de la tienda</label>
        <input
          className="form-control"
          value={storeInfo.storeName}
          onChange={(e) => setStoreInfo({ ...storeInfo, storeName: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label>Subtítulo o descripción corta</label>
        <input
          className="form-control"
          value={storeInfo.subtitle}
          onChange={(e) => setStoreInfo({ ...storeInfo, subtitle: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label>Descripción larga (SEO)</label>
        <textarea
          className="form-control"
          value={storeInfo.seoDescription}
          onChange={(e) => setStoreInfo({ ...storeInfo, seoDescription: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label>Tipo de tienda</label>
        <input
          className="form-control"
          value={storeInfo.storeType}
          onChange={(e) => setStoreInfo({ ...storeInfo, storeType: e.target.value })}
        />
      </div>

      {/* Horarios (ejemplo simplificado con solo lunes y martes) */}
      <div className="mb-3">
        <label>Lunes</label>
        <div className="d-flex gap-2">
          <input
            type="time"
            value={storeInfo.schedule.monday.open}
            onChange={(e) =>
              setStoreInfo({
                ...storeInfo,
                schedule: {
                  ...storeInfo.schedule,
                  monday: { ...storeInfo.schedule.monday, open: e.target.value },
                },
              })
            }
          />
          <input
            type="time"
            value={storeInfo.schedule.monday.close}
            onChange={(e) =>
              setStoreInfo({
                ...storeInfo,
                schedule: {
                  ...storeInfo.schedule,
                  monday: { ...storeInfo.schedule.monday, close: e.target.value },
                },
              })
            }
          />
        </div>
      </div>

      {/* Repetir lo mismo para martes, miércoles, etc... */}

      <div className="mb-3">
        <label>Logo (URL)</label>
        <input
          className="form-control"
          value={storeInfo.logoURL}
          onChange={(e) => setStoreInfo({ ...storeInfo, logoURL: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label>Avatar (URL)</label>
        <input
          className="form-control"
          value={storeInfo.avatarURL}
          onChange={(e) => setStoreInfo({ ...storeInfo, avatarURL: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label>WhatsApp</label>
        <input
          className="form-control"
          value={storeInfo.whatsapp}
          onChange={(e) => setStoreInfo({ ...storeInfo, whatsapp: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label>Teléfono</label>
        <input
          className="form-control"
          value={storeInfo.phone}
          onChange={(e) => setStoreInfo({ ...storeInfo, phone: e.target.value })}
        />
      </div>

      {/* SocialLinks: Para agregar/quitar links, podrías hacerlo con un array dinámico */}
      <div className="mb-3">
        <label>Redes sociales (ejemplo simplificado)</label>
        {storeInfo.socialLinks?.map((link, index) => (
          <div key={index} className="border p-2 mb-2">
            <div className="mb-2">
              <label>Nombre de red (ej. "Facebook")</label>
              <input
                className="form-control"
                value={link.label}
                onChange={(e) => {
                  const newLinks = [...(storeInfo.socialLinks || [])];
                  newLinks[index].label = e.target.value;
                  setStoreInfo({ ...storeInfo, socialLinks: newLinks });
                }}
              />
            </div>

            <div className="mb-2">
              <label>URL</label>
              <input
                className="form-control"
                value={link.url}
                onChange={(e) => {
                  const newLinks = [...(storeInfo.socialLinks || [])];
                  newLinks[index].url = e.target.value;
                  setStoreInfo({ ...storeInfo, socialLinks: newLinks });
                }}
              />
            </div>

            <div className="mb-2">
              <label>Ícono (Bootstrap Icons, ej. "bi bi-facebook")</label>
              <input
                className="form-control"
                value={link.icon ?? ''}
                onChange={(e) => {
                  const newLinks = [...(storeInfo.socialLinks || [])];
                  newLinks[index].icon = e.target.value;
                  setStoreInfo({ ...storeInfo, socialLinks: newLinks });
                }}
              />
            </div>

            <button
              className="btn btn-danger"
              onClick={() => {
                const newLinks = [...(storeInfo.socialLinks || [])];
                newLinks.splice(index, 1);
                setStoreInfo({ ...storeInfo, socialLinks: newLinks });
              }}
            >
              Eliminar
            </button>
          </div>
        ))}
        <button
          className="btn btn-secondary"
          onClick={() => {
            const newLinks = [...(storeInfo.socialLinks || [])];
            newLinks.push({ label: '', url: '', icon: '' });
            setStoreInfo({ ...storeInfo, socialLinks: newLinks });
          }}
        >
          + Agregar red
        </button>
      </div>

      <button className="btn btn-primary" onClick={handleSave}>
        Guardar cambios
      </button>
    </div>
  );
};

export default AdminStoreInfo;

// src/pages/admin/AdminSEO.tsx
import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig.ts';

interface SEOHomeData {
  titleTag: string; // Título (50-60 chars)
  metaDescription: string; // 150-160 chars
  keywords?: string;
  favicon?: string;

  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;

  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;

  canonicalUrl?: string;
  viewport?: string;
}

const AdminSEO: React.FC = () => {
  // SEO de HOME
  const [seoHome, setSeoHome] = useState<SEOHomeData>({
    titleTag: '',
    metaDescription: '',
    keywords: '',
    favicon: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogUrl: '',
    twitterCard: 'summary_large_image',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    canonicalUrl: '',
    viewport: 'width=device-width, initial-scale=1.0',
  });

  // Listado de productos para SEO (para actualizar su SEO individual)
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Cargar SEO de Home
  const fetchSeoHome = async () => {
    try {
      const docRef = doc(db, 'storeInfo', 'seoHome');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setSeoHome(snap.data() as SEOHomeData);
      }
    } catch (error) {
      console.error('Error fetching SEO home:', error);
    }
  };

  // 2. Guardar SEO de Home
  const saveSeoHome = async () => {
    try {
      await setDoc(doc(db, 'storeInfo', 'seoHome'), seoHome);
      alert('SEO de Home guardado exitosamente!');
    } catch (error) {
      console.error('Error saving SEO home:', error);
    }
  };

  // 3. Cargar productos (para editar su SEO)
  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchSeoHome(), fetchProducts()]).then(() => {
      setLoading(false);
    });
  }, []);

  // Manejo de SEO en producto
  const handleProductSEOUpdate = async (productId: string, field: string, value: string) => {
    // Ej: doc(db, 'products', productId), { [field]: value }
    try {
      const docRef = doc(db, 'products', productId);
      await updateDoc(docRef, {
        [field]: value,
      });
      console.log(`SEO field ${field} updated for product ${productId}`);
    } catch (error) {
      console.error('Error updating product SEO:', error);
    }
  };

  if (loading) {
    return <p>Cargando SEO...</p>;
  }

  return (
    <div className="p-3">
      <h2>SEO - Home</h2>

      <div className="mb-3">
        <label>Título (Title Tag)</label>
        <span className="ms-2 text-muted">(i) Máx 60 caracteres</span>
        <input
          className="form-control"
          maxLength={60}
          value={seoHome.titleTag}
          onChange={(e) => setSeoHome({ ...seoHome, titleTag: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label>Meta Descripción</label>
        <span className="ms-2 text-muted">(i) Máx 160 caracteres</span>
        <textarea
          className="form-control"
          maxLength={160}
          value={seoHome.metaDescription}
          onChange={(e) => setSeoHome({ ...seoHome, metaDescription: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label>Keywords (opcional)</label>
        <span className="ms-2 text-muted">(i) Lista de palabras clave separadas por comas</span>
        <input
          className="form-control"
          value={seoHome.keywords}
          onChange={(e) => setSeoHome({ ...seoHome, keywords: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label>Favicon (URL)</label>
        <span className="ms-2 text-muted">(i) .ico o .png (32x32px)</span>
        <input
          className="form-control"
          value={seoHome.favicon}
          onChange={(e) => setSeoHome({ ...seoHome, favicon: e.target.value })}
        />
      </div>

      <h4>Open Graph (OG)</h4>
      <div className="mb-3">
        <label>og:title</label>
        <span className="ms-2 text-muted">(i) Título en redes sociales</span>
        <input
          className="form-control"
          value={seoHome.ogTitle}
          onChange={(e) => setSeoHome({ ...seoHome, ogTitle: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label>og:description</label>
        <span className="ms-2 text-muted">(i) Descripción en redes sociales</span>
        <textarea
          className="form-control"
          value={seoHome.ogDescription}
          onChange={(e) => setSeoHome({ ...seoHome, ogDescription: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label>og:image</label>
        <span className="ms-2 text-muted">(i) URL de imagen 1200x630px</span>
        <input
          className="form-control"
          value={seoHome.ogImage}
          onChange={(e) => setSeoHome({ ...seoHome, ogImage: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label>og:url</label>
        <span className="ms-2 text-muted">(i) URL de la página principal</span>
        <input
          className="form-control"
          value={seoHome.ogUrl}
          onChange={(e) => setSeoHome({ ...seoHome, ogUrl: e.target.value })}
        />
      </div>

      <h4>Twitter Card</h4>
      <div className="mb-3">
        <label>twitter:card</label>
        <span className="ms-2 text-muted">(i) summary_large_image por defecto</span>
        <input
          className="form-control"
          value={seoHome.twitterCard}
          onChange={(e) => setSeoHome({ ...seoHome, twitterCard: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label>twitter:title</label>
        <input
          className="form-control"
          value={seoHome.twitterTitle}
          onChange={(e) => setSeoHome({ ...seoHome, twitterTitle: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label>twitter:description</label>
        <textarea
          className="form-control"
          value={seoHome.twitterDescription}
          onChange={(e) => setSeoHome({ ...seoHome, twitterDescription: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label>twitter:image</label>
        <input
          className="form-control"
          value={seoHome.twitterImage}
          onChange={(e) => setSeoHome({ ...seoHome, twitterImage: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label>Canonical URL</label>
        <span className="ms-2 text-muted">(i) Evita contenido duplicado</span>
        <input
          className="form-control"
          value={seoHome.canonicalUrl}
          onChange={(e) => setSeoHome({ ...seoHome, canonicalUrl: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label>Viewport</label>
        <span className="ms-2 text-muted">(i) Normalmente: width=device-width, initial-scale=1.0</span>
        <input
          className="form-control"
          value={seoHome.viewport}
          onChange={(e) => setSeoHome({ ...seoHome, viewport: e.target.value })}
        />
      </div>

      <button className="btn btn-primary" onClick={saveSeoHome}>
        Guardar SEO de Home
      </button>

      <hr />

      <h2>SEO en cada Producto</h2>
      <p className="text-muted">
        (i) Aquí puedes establecer el <em>title</em> y <em>metaDescription</em> de cada producto, 
        por ejemplo "Producto X | Nombre del Sitio".
      </p>

      {products.map((prod) => (
        <div key={prod.id} className="border p-2 mb-2">
          <strong>{prod.title}</strong> (ID: {prod.id})
          <div className="mb-2">
            <label>Título SEO</label>
            <span className="ms-1 text-muted">(máx 60 chars)</span>
            <input
              className="form-control"
              maxLength={60}
              // supongamos que en cada producto guardamos "seoTitle"
              defaultValue={prod.seoTitle || ''}
              onBlur={(e) => handleProductSEOUpdate(prod.id, 'seoTitle', e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label>Meta Descripción</label>
            <span className="ms-1 text-muted">(máx 160 chars)</span>
            <textarea
              className="form-control"
              maxLength={160}
              defaultValue={prod.seoDescription || ''}
              onBlur={(e) => handleProductSEOUpdate(prod.id, 'seoDescription', e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminSEO;

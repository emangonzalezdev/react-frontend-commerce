// src/pages/SingleItem.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig.ts';

const SingleItem: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Para el carrusel
  const [activeIndex, setActiveIndex] = useState(0);

  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  // Buscar producto en Firestore
  const fetchProductById = async (productId: string) => {
    try {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.error('Producto no encontrado');
      }
    } catch (error) {
      console.error('Error al obtener producto:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  // Cada 3 segundos, rota la imagen (si hay más de 1)
  useEffect(() => {
    if (product?.images && product.images.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % product.images.length);
      }, 3000);

      // Limpieza
      return () => clearInterval(interval);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity,
      image: product.images?.[0] || ''
    });

    // Navegar a Home
    navigate('/', { state: { showCart: true } });
  };

  if (loading) {
    return <p>Cargando producto...</p>;
  }
  if (!product) {
    return <p>Producto no encontrado</p>;
  }

  // Si no hay imágenes, mostramos fallback
  const hasImages = product.images && product.images.length > 0;
  const currentImage = hasImages ? product.images[activeIndex] : 'https://via.placeholder.com/300';

  return (
    <div className="container my-4">
      {/* Carrusel simple */}
      <div className="text-center">
        <img
          src={currentImage}
          alt={product.title}
          style={{ maxWidth: '300px', borderRadius: '10px' }}
        />
        {/* Opcional: indicadores de las imágenes */}
        {hasImages && (
          <div className="mt-2">
            {product.images.map((_, idx: number) => (
              <span
                key={idx}
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: idx === activeIndex ? 'blue' : 'gray',
                  marginRight: '5px',
                }}
              />
            ))}
          </div>
        )}
      </div>

      <h2 className="mt-3">{product.title}</h2>
      <h4 className="text-muted">{product.subtitle}</h4>
      <h3 className="my-2">${product.price}</h3>

      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-secondary"
          onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
        >
          -
        </button>
        <span>{quantity}</span>
        <button className="btn btn-secondary" onClick={() => setQuantity(quantity + 1)}>
          +
        </button>
      </div>

      <div className="my-3">
        <label>Notas adicionales</label>
        <textarea
          className="form-control"
          placeholder="Escribe toda información adicional sobre tu pedido"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="my-3">
        <strong>Total parcial: ${product.price * quantity}</strong>
      </div>

      <button className="btn btn-primary" onClick={handleAddToCart}>
        Agregar al pedido
      </button>
    </div>
  );
};

export default SingleItem;

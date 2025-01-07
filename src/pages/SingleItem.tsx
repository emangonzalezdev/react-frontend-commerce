// src/pages/SingleItem.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig.ts';
import { FaArrowLeft } from 'react-icons/fa'; // para la flecha atrás
import './SingleItem.css'; // importar el CSS
import { Helmet } from 'react-helmet'; // Importar Helmet



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

      return () => clearInterval(interval);
    }
  }, [product]);

  const handleBack = () => {
    navigate('/');
  };

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity,
      // Imagen para el cart
      image: product.images?.[0] || ''
    });

    navigate('/', { state: { showCart: true } });
  };

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Cargando producto...</p>;
  }
  if (!product) {
    return <p style={{ textAlign: 'center' }}>Producto no encontrado</p>;
  }

  // Carrusel simple
  const hasImages = product.images && product.images.length > 0;
  const currentImage = hasImages
    ? product.images[activeIndex]
    : 'https://via.placeholder.com/300';

  return (
    <div className="singleitem-container">
      <Helmet>
        <title>{product.seoTitle || `${product.title} | MiSitio`}</title>
        <meta name="description" content={product.seoDescription || product.subtitle} />
      </Helmet>
      
      {/* Banner / Carrusel */}
      <div className="singleitem-banner-wrapper">
        {/* Flecha de volver arriba a la izquierda */}
        <button className="singleitem-back-arrow" onClick={handleBack}>
          <FaArrowLeft />
        </button>

        <img
          src={currentImage}
          alt={product.title}
          className="singleitem-banner-image"
        />

        {/* Indicadores (dots) */}
        {hasImages && (
          <div className="singleitem-indicators" style={{ textAlign: 'center' }}>
            {product.images.map((_: any, idx: number) => (
              <span
                key={idx}
                className="singleitem-indicator-dot"
                style={{
                  backgroundColor: idx === activeIndex ? 'blue' : 'gray'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Contenido centrado */}
      <h2 className="singleitem-title">{product.title}</h2>
      <h4 className="singleitem-subtitle text-muted">{product.subtitle}</h4>
      <h3 className="singleitem-price my-2">${product.price}</h3>

      {/* Controles de cantidad */}
      <div className="singleitem-quantity-controls">
        <button
          className="singleitem-quantity-btn"
          onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
        >
          -
        </button>
        <span>{quantity}</span>
        <button
          className="singleitem-quantity-btn"
          onClick={() => setQuantity(quantity + 1)}
        >
          +
        </button>
      </div>

      {/* Notas adicionales */}
      <div className="singleitem-addnotes">
        <label>Notas adicionales</label>
        <textarea
          placeholder="Escribe toda información adicional sobre tu pedido"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="singleitem-total">
        <strong>Total parcial: ${product.price * quantity}</strong>
      </div>

      {/* Botón para agregar al pedido */}
      <button className="singleitem-addtocart-btn" onClick={handleAddToCart}>
        Agregar al pedido
      </button>
    </div>
  );
};

export default SingleItem;

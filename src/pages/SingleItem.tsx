// src/pages/SingleItem.tsx

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Este componente se nutrirá de un "product" real, ya sea de un backend o de un contexto global, etc.
import { useCart } from '../context/CartContext.tsx';

const SingleItem: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Datos simulados
  // En la práctica, buscaríamos el producto por ID en una base de datos o en un estado global
  const productMock = {
    id,
    title: 'Título de producto',
    subtitle: 'Subtítulo del producto',
    price: 12345,
    image: 'https://via.placeholder.com/300',
  };

  const [quantity, setQuantity] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  const handleAddToCart = () => {
    // Aquí guardaríamos el producto al "cart"
    // Por simplicidad, solo redirigimos y mostramos el carrito
    addToCart({
        id: productMock.id,
        title: productMock.title,
        price: productMock.price,
        quantity,
        image: productMock.image,
      });
  
    navigate('/', { state: { showCart: true, product: productMock, quantity, notes } });
  };

  return (
    <div className="container my-4">
      <div className="text-center">
        <img
          src={productMock.image}
          alt={productMock.title}
          style={{ maxWidth: '300px', borderRadius: '10px' }}
        />
      </div>
      <h2 className="mt-3">{productMock.title}</h2>
      <h4 className="text-muted">{productMock.subtitle}</h4>
      <h3 className="my-2">${productMock.price}</h3>

      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-secondary"
          onClick={() => setQuantity(quantity > 0 ? quantity - 1 : 0)}
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
        <strong>Total parcial: ${productMock.price * quantity}</strong>
      </div>

      <button className="btn btn-primary" onClick={handleAddToCart}>
        Agregar al pedido
      </button>
    </div>
  );
};

export default SingleItem;

// src/components/ProductItem.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductItemData } from '../types/ProductItemData';

interface ProductItemProps {
  product: ProductItemData;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleItemClick = () => {
    // Navega a la vista de SingleItem con el ID del producto
    navigate(`/item/${product.id}`);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-between p-2 border mb-2"
      style={{ borderRadius: '10px' }}
    >
      <div className="d-flex flex-column">
        <strong>{product.title}</strong>
        <span>{product.subtitle}</span>
        <span className="fw-bold">${product.price}</span>
        <button
          className="btn btn-warning btn-sm mt-2"
          style={{ borderRadius: '20px' }}
          onClick={handleItemClick}
        >
          Pedir +
        </button>
      </div>
      <div>
        <img
          src={product.images[0]}
          alt={product.title}
          style={{ width: '150px'}}
        />
      </div>
    </div>
  );
};

export default ProductItem;

// src/components/ProductDropdown.tsx

import React, { useState } from 'react';

import { ProductItemData } from '../types/ProductItemData';
import ProductItem from './ProductItem.tsx';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface ProductDropdownProps {
  sectionName: string;
  products: ProductItemData[];
}

const ProductDropdown: React.FC<ProductDropdownProps> = ({
  sectionName,
  products,
}) => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="my-2">
      <button
        className="product-dropdown-button"
        onClick={handleToggle}
      >
        <span>{sectionName}</span>
        {open ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {open && (
        <div className="product-dropdown-content">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDropdown;

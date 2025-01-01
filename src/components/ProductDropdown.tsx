// src/components/ProductDropdown.tsx

import React, { useState } from 'react';
import { Collapse, Button } from 'react-bootstrap';
import { ProductItemData } from '../types/ProductItemData';
import ProductItem from './ProductItem.tsx';

interface ProductDropdownProps {
  sectionName: string;
  products: ProductItemData[];
}

const ProductDropdown: React.FC<ProductDropdownProps> = ({
  sectionName,
  products,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-2">
      <Button
        variant="info"
        onClick={() => setOpen(!open)}
        aria-controls={`${sectionName}-collapse`}
        aria-expanded={open}
        className="text-white"
      >
        {sectionName}
      </Button>
      <Collapse in={open}>
        <div id={`${sectionName}-collapse`} className="mt-2">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default ProductDropdown;

// src/types/ProductItemData.ts

export interface ProductItemData {
    category: string;
    id: string;
    title: string;
    subtitle: string;
    price: number;
    image: string;
    images: string[];
  }
  
export interface CategoryNode {
  id: string;
  name: string;
  parentId?: string | null;
  children: CategoryNode[];
}
  
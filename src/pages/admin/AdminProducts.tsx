// src/pages/admin/AdminProducts.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { db } from '../../services/firebaseConfig.ts';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';

/** Interfaz de Producto */
interface Product {
  id?: string;
  title: string;
  subtitle: string;
  longDescription?: string;  // (1) Descripción larga
  price: number;
  // (2) Campo de imágenes múltiples
  // Podrá ser un array de strings con URLs
  images: string[];
  // Categoría elegida desde un dropdown
  category: string;
}

/** Interfaz de Categoría (simple) */
interface Category {
  id: string;
  name: string;
  description?: string;
}

const AdminProducts: React.FC = () => {
  // Estado de la lista de productos
  const [products, setProducts] = useState<Product[]>([]);

  // Estado para el nuevo/edición producto
  const [newProduct, setNewProduct] = useState<Product>({
    title: '',
    subtitle: '',
    longDescription: '',
    price: 0,
    images: [],   // array vacío
    category: '',
  });

  // Estado para lista de categorías (para el dropdown)
  const [categories, setCategories] = useState<Category[]>([]);

  // Para controlar si estamos en "modo edición" de un producto existente
  const [editProductId, setEditProductId] = useState<string | null>(null);

  // Referencias de colecciones
  const productsRef = collection(db, 'products');
  const categoriesRef = collection(db, 'categories');

  /** (5.4) Obtener productos de Firestore */
  const fetchProducts = useCallback(async () => {
    try {
      const snapshot = await getDocs(productsRef);
      const data: Product[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Product[];
      setProducts(data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  }, [productsRef]);

  /** Obtener categorías de Firestore */
  const fetchCategories = useCallback(async () => {
    try {
      const snapshot = await getDocs(categoriesRef);
      const data: Category[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Category, 'id'>),
      }));
      setCategories(data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  }, [categoriesRef]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchCategories, fetchProducts]);

  /** (5.3) Crear o actualizar producto */
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editProductId) {
        // (4) Modo edición: actualizar producto existente
        const docRef = doc(db, 'products', editProductId);
        await updateDoc(docRef, {
          title: newProduct.title,
          subtitle: newProduct.subtitle,
          longDescription: newProduct.longDescription,
          price: newProduct.price,
          images: newProduct.images,
          category: newProduct.category,
        });
        console.log('Producto actualizado en Firestore');
      } else {
        // Modo creación: agregar producto
        await addDoc(productsRef, {
          title: newProduct.title,
          subtitle: newProduct.subtitle,
          longDescription: newProduct.longDescription,
          price: newProduct.price,
          images: newProduct.images,
          category: newProduct.category,
        });
        console.log('Producto agregado a Firestore');
      }

      // Limpieza
      setNewProduct({
        title: '',
        subtitle: '',
        longDescription: '',
        price: 0,
        images: [],
        category: '',
      });
      setEditProductId(null);

      // Recargar lista
      fetchProducts();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  /** Función para cargar datos en el formulario y editar */
  const handleEdit = async (id?: string) => {
    if (!id) return;
    try {
      const docRef = doc(db, 'products', id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const prod = snapshot.data() as Product;
        setNewProduct({
          id,
          title: prod.title,
          subtitle: prod.subtitle,
          longDescription: prod.longDescription ?? '',
          price: prod.price,
          images: prod.images ?? [],
          category: prod.category,
        });
        setEditProductId(id);
      }
    } catch (error) {
      console.error('Error al cargar producto para edición:', error);
    }
  };

  /** Función para eliminar */
  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  /** Para manejar el array de imágenes */
  const handleAddImage = () => {
    setNewProduct({
      ...newProduct,
      images: [...newProduct.images, ''], // se agrega un espacio vacío
    });
  };

  const handleImageChange = (index: number, newUrl: string) => {
    const updatedImages = [...newProduct.images];
    updatedImages[index] = newUrl;
    setNewProduct({ ...newProduct, images: updatedImages });
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...newProduct.images];
    updatedImages.splice(index, 1);
    setNewProduct({ ...newProduct, images: updatedImages });
  };

  // Render
  return (
    <div className="container mt-5">
      <h2>Administra tus Productos</h2>

      <form onSubmit={handleSaveProduct} className="mb-4">
        <div className="mb-2">
          <label>Título</label>
          <input
            type="text"
            className="form-control"
            value={newProduct.title}
            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
            required
          />
        </div>

        <div className="mb-2">
          <label>Subtítulo</label>
          <input
            type="text"
            className="form-control"
            value={newProduct.subtitle}
            onChange={(e) => setNewProduct({ ...newProduct, subtitle: e.target.value })}
          />
        </div>

        {/* (1) Descripción Larga */}
        <div className="mb-2">
          <label>Descripción Larga (opcional)</label>
          <textarea
            className="form-control"
            value={newProduct.longDescription}
            onChange={(e) => setNewProduct({ ...newProduct, longDescription: e.target.value })}
            rows={3}
          />
        </div>

        <div className="mb-2">
          <label>Precio</label>
          <input
            type="number"
            className="form-control"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
            required
          />
        </div>

        {/* (2) Múltiples imágenes */}
        <div className="mb-2">
         <div><label>Imágen/es del producto</label></div> 
          {newProduct.images.map((imgUrl, index) => (
            <div key={index} className="d-flex gap-2 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="URL de imagen"
                value={imgUrl}
                onChange={(e) => handleImageChange(index, e.target.value)}
              />
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleRemoveImage(index)}
              >
                Borrar
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleAddImage}
          >
            + Agregar imagen
          </button>
        </div>

        {/* (2.1) Subir imagen desde el ordenador (opcional, usando Firebase Storage) */}
        {/* O podrías crear un componente adicional que maneje la subida y devuelva la URL */}

        {/* (3) Categoría dropdown */}
        <div className="mb-2">
          <label>Categoría</label>
          <select
            className="form-select"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          >
            <option value="">-- Seleccionar --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          {editProductId ? 'Actualizar producto' : 'Agregar producto'}
        </button>
      </form>

      <hr />

      <h4>Lista de productos:</h4>
      {products.map((prod) => (
        <div
          key={prod.id}
          className="border p-2 mb-2 d-flex justify-content-between align-items-center"
        >
          <div>
            <strong>{prod.title}</strong> - {prod.subtitle} - ${prod.price} 
            <br />
            Categoría: {prod.category}  
          </div>
          <div>
            {/* (4) Botón para editar */}
            <button
              className="btn btn-warning btn-sm me-2"
              onClick={() => handleEdit(prod.id)}
            >
              Editar
            </button>
            {/* Eliminar */}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(prod.id)}
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminProducts;

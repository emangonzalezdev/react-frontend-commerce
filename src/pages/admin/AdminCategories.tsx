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

interface Category {
  id?: string;
  name: string;
  description?: string;
  parentId?: string | null;
}

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<Category>({
    name: '',
    description: '',
    parentId: null,
  });
  const [editCatId, setEditCatId] = useState<string | null>(null);

  const categoriesRef = collection(db, 'categories');

  const fetchCategories = useCallback(async () => {
    const snapshot = await getDocs(categoriesRef);
    const data: Category[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Category, 'id'>),
    }));
    setCategories(data);
  }, [categoriesRef]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ajuste para si el user selecciona 'null' en el select
      const finalParentId =
        newCategory.parentId === '' ? null : newCategory.parentId;

      if (editCatId) {
        // Editar categoría existente
        const docRef = doc(db, 'categories', editCatId);
        await updateDoc(docRef, {
          name: newCategory.name,
          description: newCategory.description,
          parentId: finalParentId,
        });
      } else {
        // Crear nueva categoría
        await addDoc(categoriesRef, {
          name: newCategory.name,
          description: newCategory.description,
          parentId: finalParentId,
        });
      }

      setNewCategory({ name: '', description: '', parentId: null });
      setEditCatId(null);
      fetchCategories();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
    }
  };

  const handleEditCat = async (id: string) => {
    const docRef = doc(db, 'categories', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const catData = snap.data() as Category;
      setNewCategory({
        name: catData.name,
        description: catData.description || '',
        parentId: catData.parentId || null,
      });
      setEditCatId(id);
    }
  };

  const handleDeleteCat = async (id: string) => {
    // Podrías validar si esta categoría tiene hijos antes de permitir borrarla
    try {
      await deleteDoc(doc(db, 'categories', id));
      fetchCategories();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

  return (
    <div className="container mt-3">
      <h2>Categorías</h2>
      <form onSubmit={handleSaveCategory} className="mb-4">
        <div className="mb-2">
          <label>Nombre</label>
          <input
            className="form-control"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
        </div>
        <div className="mb-2">
          <label>Descripción</label>
          <input
            className="form-control"
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory({ ...newCategory, description: e.target.value })
            }
          />
        </div>

        {/* Dropdown para elegir categoria padre */}
        <div className="mb-2">
          <label>Categoría padre</label>
          <select
            className="form-select"
            value={newCategory.parentId ?? ''}
            onChange={(e) =>
              setNewCategory({ ...newCategory, parentId: e.target.value })
            }
          >
            {/* Opción "sin padre" */}
            <option value="">(Ninguna)</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-success">
          {editCatId ? 'Actualizar Categoría' : 'Agregar Categoría'}
        </button>
      </form>

      <hr />

      <h4>Lista de categorías (padre . hijos):</h4>
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="border p-2 mb-2 d-flex justify-content-between align-items-center"
        >
          <div>
            <strong>{cat.name}</strong> {cat.parentId && ` (hijo de ${cat.parentId})`}
            <br />
            {cat.description}
          </div>
          <div>
            <button
              className="btn btn-warning btn-sm me-2"
              onClick={() => handleEditCat(cat.id!)}
            >
              Editar
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDeleteCat(cat.id!)}
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminCategories;

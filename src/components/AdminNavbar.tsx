// src/components/AdminNavbar.tsx

import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

const AdminNavbar: React.FC = () => {
  // Estado para controlar si se muestra u oculta el sidebar en pantallas pequeñas
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="container-fluid p-0">
      {/* -- Barra superior para mobile -- */}
      <div className="bg-light p-2 d-flex d-md-none justify-content-between align-items-center">
        <h4 className="mb-0">Admin Panel</h4>
        <button className="btn btn-outline-secondary" onClick={() => setIsOpen(!isOpen)}>
          <FaBars />
        </button>
      </div>

      <div className="row g-0">
        {/* -- Sidebar / Navbar vertical -- */}
        {/* En desktop (md+), se muestra. En mobile (sm), se oculta si isOpen==false */}
        <div
          className={`col-12 col-md-2 bg-light ${
            isOpen ? '' : 'd-none d-md-block'
          }`}
          style={{ minHeight: '100vh' }}
        >
          <div className="p-2 d-none d-md-block">
            <h4>Admin Panel</h4>
          </div>
          <ul className="nav flex-column mt-3">
            {/* Sección Productos con submenú Categorías */}
            <li className="nav-item">
              <Link className="nav-link" to="/admin/products">
                Productos
              </Link>
              <ul className="nav flex-column ms-3">
                <li className="nav-item">
                  {/* Ajusta la ruta según hayas definido en AppRouter */}
                  <Link className="nav-link" to="/admin/categories">
                    Categorías
                  </Link>
                </li>
              </ul>
            </li>

            {/* Otras secciones */}
            <li className="nav-item">
              <Link className="nav-link" to="/admin/store-info">
                Datos de mi tienda
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/design">
                Diseño del sitio
              </Link>
            </li>

            {/* Nuevo link a SEO */}
            <li className="nav-item">
              <Link className="nav-link" to="/admin/seo">
                SEO
              </Link>
            </li>
          </ul>
        </div>

        {/* -- Contenido principal -- */}
        <div className="col-12 col-md-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;

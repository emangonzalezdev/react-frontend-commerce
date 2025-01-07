// src/routes/AppRouter.tsx (ejemplo)
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home.tsx';
import SingleItem from '../pages/SingleItem.tsx';
import Login from '../pages/Login.tsx';
import AdminNavbar from '../components/AdminNavbar.tsx'; // lo crearemos
import AdminProducts from '../pages/admin/AdminProducts.tsx';
import AdminStoreInfo from '../pages/admin/AdminStoreInfo.tsx';
import AdminDesign from '../pages/admin/AdminDesign.tsx';
import AdminCategories from '../pages/admin/AdminCategories.tsx' // <-- Importamos el componente
import PrivateRoute from './PrivateRoute.tsx';
import AdminSEO from '../pages/admin/AdminSEO.tsx';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/item/:id" element={<SingleItem />} />
        <Route path="/login" element={<Login />} />

        {/* Zona de rutas protegidas con <PrivateRoute> */}
        <Route element={<PrivateRoute adminOnly={true} />}>
          {/* Un “layout” que comparte el AdminNavbar y las distintas secciones */}
          <Route path="/admin" element={<AdminNavbar />}>
            <Route path="products" element={<AdminProducts />} />
            <Route path="store-info" element={<AdminStoreInfo />} />
            <Route path="design" element={<AdminDesign />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="seo" element={<AdminSEO />} />
         
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

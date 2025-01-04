// src/routes/PrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';

const PrivateRoute: React.FC<{ adminOnly?: boolean }> = ({ adminOnly }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    // Si no está logueado, redireccionamos al /login
    return <Navigate to="/login" />;
  }

  // Opcional: Verificar si es el admin
  if (adminOnly) {
    // Por ejemplo, check de email
    if (user.email !== 'fabiangonzalezdev@gmail.com') {
      return <p>No tienes permisos para acceder a esta página.</p>;
    }
  }

  // Si todo OK, renderizamos la ruta solicitada
  return <Outlet />;
};

export default PrivateRoute;

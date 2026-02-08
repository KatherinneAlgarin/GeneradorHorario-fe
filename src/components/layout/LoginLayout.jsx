import React from 'react';
import { Outlet } from 'react-router-dom';
/* IMPORTANTE: La ruta debe coincidir con tu carpeta styles */
import '../../styles/LoginLayout.css'; 

const LoginLayout = () => {
  return (
    /* IMPORTANTE: Esta clase debe ser IGUAL a la del CSS de arriba */
    <div className="login-layout-container">
      <Outlet />
    </div>
  );
};

export default LoginLayout;
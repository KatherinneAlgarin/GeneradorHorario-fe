import React from 'react';
import { Outlet } from 'react-router-dom';

// VERIFICA ESTA LÍNEA CUIDADOSAMENTE:
// Significa: "Sal de layout (..), sal de components (..), entra a styles, busca AuthLayout.css"
import '../../styles/LoginLayout.css'; 

const AuthLayout = () => {
  return (
    <div className="auth-container">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
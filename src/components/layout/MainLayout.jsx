import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Para saber en qué ruta estamos y marcarla activa

  const handleLogout = () => {
    // Aquí borrarías el token del usuario más adelante
    navigate('/login');
  };

  return (
    <div className="layout-container">
      
      {/* 1. SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">Universidad 🎓</div>
        
        <ul className="nav-links">
          <li className="nav-item">
            <Link 
              to="/admin" 
              className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/usuarios" className="nav-link">
              Gestionar Usuarios
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/horarios" className="nav-link">
              Horarios
            </Link>
          </li>
          {/* Agrega aquí más opciones según necesites */}
        </ul>
      </aside>

      {/* 2. HEADER */}
      <header className="header">
        <div className="header-title">Panel de Administración</div>
        
        <div className="user-profile">
          <span>Hola, <strong>Administrador</strong></span>
          <button onClick={handleLogout} className="btn-logout">
            Salir
          </button>
        </div>
      </header>

      {/* 3. CONTENIDO DINÁMICO */}
      <main className="main-content">
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;
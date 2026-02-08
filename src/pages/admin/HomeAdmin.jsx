import React from 'react';
import '../../styles/AdminDashboard.css'; // Importamos los estilos

export default function AdminDashboard() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Bienvenido al Sistema</h1>
      <p className="dashboard-subtitle">Selecciona una opción del menú para comenzar a trabajar.</p>
      
      <div className="dashboard-card">
        <h3>Resumen rápido</h3>
        <p>Aquí pondremos gráficas o estadísticas después.</p>
      </div>
    </div>
  );
}
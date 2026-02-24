import React, { useState } from 'react';
import Tabs from '../../components/common/Tabs';
import '../../styles/AdminDashboard.css';
import GestorFacultades from './GestorFacultades';
import GestorCarreras from './GestorCarreras';
import GestorPlanEstudio from './GestorPlanEstudio';
import GestorMaterias from './GestorMaterias';
import GestorAulas from './GestorAulas';
import GestorCiclos from './GestorCiclos';

const OpcionTabs = () => {
  const [activeTab, setActiveTab] = useState('faculties');

  const tabOptions = [
    { id: 'faculties', label: 'Facultades' },
    { id: 'careers', label: 'Carreras' },
    { id: 'plans', label: 'Planes de Estudio' },
    { id: 'subjects', label: 'Materias' },
    { id: 'ciclos', label: 'Ciclos Académicos' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'faculties': return <GestorFacultades />;
      case 'careers': return <GestorCarreras />;
      case 'plans': return <GestorPlanEstudio />;
      case 'subjects': return <GestorMaterias />;
      case 'ciclos': return <GestorCiclos />;
      default: return <GestorFacultades />;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h2 style={{ color: '#333', marginBottom: '10px' }}>Gestión Académica</h2>
      </div>

      <Tabs 
        tabs={tabOptions} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default OpcionTabs;
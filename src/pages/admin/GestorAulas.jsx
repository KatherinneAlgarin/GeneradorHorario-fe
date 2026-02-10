import React, { useState, useEffect } from 'react';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import ModalGeneral from '../../components/common/ModalGeneral'; // Tu Modal Genérico
import { useAulas } from '../../hooks/useAulas';
import '../../styles/AdminDashboard.css';

const GestorAulas = () => {
  // 1. Extraemos TODO del Hook
  const { 
    aulas, tiposAula, 
    searchTerm, setSearchTerm, modalState,
    openAddModal, openEditModal, closeModal,
    handleSaveAula, deleteAula, toggleStatus
  } = useAulas();

  // 2. Estado local SOLO para el formulario visual (inputs)
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (modalState.isOpen) setFormData(modalState.data);
  }, [modalState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Envío al Hook (sin lógica aquí)
  const handleSubmit = () => handleSaveAula(formData);

  // --- COLUMNAS ---
  const columns = [
    { header: 'Aula', accessor: 'nombre' },
    { header: 'Ubicación', accessor: 'ubicacion' },
    { header: 'Capacidad', accessor: 'capacidad' },
    { 
      header: 'Tipo', 
      accessor: 'id_tipo_aula',
      // Buscamos el nombre usando el catálogo que nos dio el hook
      render: (row) => tiposAula.find(t => t.id_tipo === parseInt(row.id_tipo_aula))?.nombre || 'Desconocido'
    },
    { header: 'Equipamiento', accessor: 'equipamiento' },
    { 
      header: 'Estado', accessor: 'activo',
      render: (row) => (
        <span 
          className={`status-badge ${row.activo ? 'status-active' : 'status-inactive'}`}
          onClick={() => toggleStatus(row.id_aula)}
          style={{ cursor: 'pointer' }}
        >
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    }
  ];

  const renderActions = (row) => (
    <div className="action-buttons">
      <button className="btn-icon edit" onClick={() => openEditModal(row)} title="Editar">✏️</button>
      <button className="btn-icon delete" onClick={() => deleteAula(row.id_aula)} title="Eliminar">🗑️</button>
    </div>
  );

  return (
    <div className="tab-view-container">
      
      {/* HEADER + BOTÓN */}
      <div className="page-header" style={{ marginTop: '20px' }}>
        <h3 style={{ color: '#555' }}>Infraestructura y Aulas</h3>
        <button className="btn-primary" onClick={openAddModal}>+ Nueva Aula</button>
      </div>

      {/* FILTROS */}
      <div className="filters-bar">
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar aula..." />
      </div>

      {/* TABLA */}
      <Table columns={columns} data={aulas} actions={renderActions} />

      {/* MODAL */}
      <ModalGeneral
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.type === 'add' ? 'Registrar Aula' : 'Editar Aula'}
        footer={
          <>
            <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
            <button className="btn-save" onClick={handleSubmit}>Guardar</button>
          </>
        }
      >
        {formData && (
          <>
            <div className="form-row">
              <div className="form-group-modal">
                <label>Nombre / Número</label>
                <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej. A-201" />
              </div>
              <div className="form-group-modal">
                <label>Ubicación</label>
                <input name="ubicacion" value={formData.ubicacion} onChange={handleChange} placeholder="Ej. Edificio B" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group-modal">
                <label>Tipo de Aula</label>
                <select name="id_tipo_aula" value={formData.id_tipo_aula} onChange={handleChange}>
                  <option value="">-- Seleccione --</option>
                  {/* Llenamos el select con el catálogo del Hook */}
                  {tiposAula.map(tipo => (
                    <option key={tipo.id_tipo} value={tipo.id_tipo}>{tipo.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-group-modal">
                <label>Capacidad</label>
                <input type="number" name="capacidad" value={formData.capacidad} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group-modal" style={{ width: '100%' }}>
                <label>Equipamiento</label>
                <textarea 
                  name="equipamiento" 
                  value={formData.equipamiento} 
                  onChange={handleChange}
                  rows="3"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  placeholder="Ej. Proyector, Aire Acondicionado..."
                />
              </div>
            </div>
          </>
        )}
      </ModalGeneral>
    </div>
  );
};

export default GestorAulas;
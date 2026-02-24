import React from 'react';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import ModalGeneral from '../../components/common/ModalGeneral';
import { useCiclos } from '../../hooks/useCiclos';
import '../../styles/AdminDashboard.css';

const GestorCiclos = () => {
  const {
    ciclos, columns, searchTerm, setSearchTerm,
    modalState, loading,
    openAddModal, openEditModal, closeModal,
    handleSaveCiclo, handleInputChange, handleActivarCiclo
  } = useCiclos();

  const formData = modalState.data;

  const renderActions = (row) => (
    <div className="action-buttons">
      {!row.activo && (
        <button 
          className="btn-text-edit" 
          style={{ color: '#059669', borderColor: '#10b981', backgroundColor: '#ecfdf5' }} // Estilo verde para activar
          onClick={() => handleActivarCiclo(row.id_ciclo_academico)}
        >
          Activar
        </button>
      )}
      <button 
        className="btn-text-edit" 
        onClick={() => openEditModal(row)}
      >
        Editar
      </button>
    </div>
  );

  return (
    <div className="tab-view-container">
      <div className="page-header">
        <h3 className="text-muted">Ciclos Académicos</h3>
        <button className="btn-primary" onClick={openAddModal}>+ Nuevo Ciclo</button>
      </div>

      <div className="filters-bar">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar ciclo..."
        />
      </div>

      {loading ? (
        <div className="loading-container">Cargando ciclos...</div>
      ) : (
        <Table columns={columns} data={ciclos} actions={renderActions} />
      )}

      <ModalGeneral
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.type === 'add' ? 'Crear Nuevo Ciclo' : 'Editar Ciclo'}
        footer={
          <>
            <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
            <button className="btn-save" onClick={() => handleSaveCiclo(formData)}>Guardar</button>
          </>
        }
      >
        {formData && (
          <>
            <div className="form-row">
              <div className="form-group-modal full-width">
                <label>Nombre del Ciclo</label>
                <input
                  name="nombre"
                  value={formData.nombre || ''}
                  onChange={handleInputChange}
                  placeholder="Ej. Ciclo I - 2024"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group-modal">
                <label>Fecha de Inicio</label>
                <input
                  type="date"
                  name="fecha_inicio"
                  value={formData.fecha_inicio || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group-modal">
                <label>Fecha de Finalización</label>
                <input
                  type="date"
                  name="fecha_fin"
                  value={formData.fecha_fin || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </>
        )}
      </ModalGeneral>
    </div>
  );
};

export default GestorCiclos;
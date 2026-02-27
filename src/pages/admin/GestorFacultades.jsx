import React from 'react';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import Filtro from '../../components/common/Filtro';
import ModalGeneral from '../../components/common/ModalGeneral';
import Notification from '../../components/common/Notification';
import { useFacultades } from '../../hooks/useFacultades';
import '../../styles/AdminDashboard.css';

const GestorFacultades = () => {
  const { 
    facultades, columns, 
    searchTerm, setSearchTerm, 
    filterEstado, setFilterEstado, 
    modalState, openAddModal, openEditModal, closeModal, 
    handleSaveFacultad, handleInputChange, loading,
    executeToggleStatus,
    notification, setNotification,
    notificationModal, setNotificationModal
  } = useFacultades();

  const formData = modalState.data;

  const renderActions = (row) => (
    <div className="action-buttons">
      <button 
        className="btn-text-edit" 
        onClick={() => openEditModal(row)} 
        title="Editar Facultad"
      >
        Editar
      </button>
    </div>
  );

  return (
    <div className="tab-view-container">
      <div className="page-header">
        <h3 className="text-muted">Facultades</h3>
        <button className="btn-primary" onClick={openAddModal}>+ Nueva Facultad</button>
      </div>

      <div className="filters-bar" style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        <SearchBar 
          value={searchTerm} 
          onChange={setSearchTerm} 
          placeholder="Buscar facultad por nombre..." 
        />
        <Filtro 
          value={filterEstado} 
          onChange={setFilterEstado} 
          defaultLabel="Todos los estados"
          options={[
            { label: 'Activas', value: 'activos' },
            { label: 'Inactivas', value: 'inactivos' }
          ]} 
        />
      </div>

      {notification.show && (
        <Notification 
          show={notification.show}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}

      {loading ? (
        <div className="loading-container">Cargando facultades...</div>
      ) : (
        <Table columns={columns} data={facultades} actions={renderActions} />
      )}

      <ModalGeneral
        isOpen={modalState.isOpen}
        onClose={closeModal}
        // Título dinámico
        title={
          modalState.type === 'add' ? 'Registrar Facultad' : 
          modalState.type === 'edit' ? 'Editar Facultad' : 
          'Confirmar Acción'
        }
        footer={
          modalState.type === 'confirmToggle' ? (
            <>
              <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
              <button 
                className="btn-save" 
                style={{ backgroundColor: '#da2525' }} 
                onClick={executeToggleStatus}
              >
                Confirmar
              </button>
            </>
          ) : (
            <>
              <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
              <button className="btn-save" onClick={() => handleSaveFacultad(formData)}>Guardar</button>
            </>
          )
        }
      >
        {notificationModal.show && modalState.isOpen && (
          <Notification 
            show={notificationModal.show}
            message={notificationModal.message}
            type={notificationModal.type}
            onClose={() => setNotificationModal({ ...notificationModal, show: false })}
          />
        )}
        
        {modalState.type === 'confirmToggle' ? (
          <div style={{ padding: '20px 0', textAlign: 'center', fontSize: '1.1rem' }}>
            <p>
              ¿Estás seguro de que deseas <strong>{formData?.activo ? 'dar de baja' : 'reactivar'}</strong> la facultad de <strong>{formData?.nombre}</strong>?
            </p>
          </div>
        ) : (
          formData && (
            <>
              <div className="form-row">
                <div className="form-group-modal full-width">
                  <label>Nombre de Facultad</label>
                  <input 
                    name="nombre"
                    value={formData.nombre || ''} 
                    onChange={handleInputChange} 
                    placeholder="Ej. Facultad de Ingeniería y Arquitectura" 
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group-modal full-width">
                  <label>Descripción</label>
                  <textarea 
                    name="descripcion"
                    className="form-textarea"
                    value={formData.descripcion || ''} 
                    onChange={handleInputChange} 
                    placeholder="Breve descripción..."
                  />
                </div>
              </div>
            </>
          )
        )}
      </ModalGeneral>
    </div>
  );
};

export default GestorFacultades;
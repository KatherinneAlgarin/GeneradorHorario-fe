import React from 'react';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import Filtro from '../../components/common/Filtro';
import ModalGeneral from '../../components/common/ModalGeneral';
import Notification from '../../components/common/Notification';
import { useCarreras } from '../../hooks/useCarreras';
import '../../styles/AdminDashboard.css';

const GestorCarreras = () => {
  const { 
    carreras, facultades, columns, 
    searchTerm, setSearchTerm, 
    filterFacultad, setFilterFacultad, 
    filterEstado, setFilterEstado,
    modalState, openAddModal, openEditModal, closeModal, 
    handleSaveCarrera, handleInputChange, loading,
    executeToggleStatus,
    notification, setNotification,
    notificationModal, setNotificationModal
  } = useCarreras();

  const formData = modalState.data;

  const renderActions = (row) => (
    <div className="action-buttons">
      <button 
        className="btn-text-edit" 
        onClick={() => openEditModal(row)} 
        title="Editar Carrera"
      >
        Editar
      </button>
    </div>
  );

  const opcionesFacultades = facultades.map(fac => ({
    label: fac.nombre,
    value: fac.id_facultad
  }));

  return (
    <div className="tab-view-container">
      <div className="page-header">
        <h3 className="text-muted">Carreras Universitarias</h3>
        <button className="btn-primary" onClick={openAddModal}>+ Nueva Carrera</button>
      </div>

      <div className="filters-bar" style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        <SearchBar 
          value={searchTerm} 
          onChange={setSearchTerm} 
          placeholder="Buscar por código o nombre..." 
        />
        <Filtro 
          value={filterFacultad} 
          onChange={setFilterFacultad} 
          defaultLabel="Todas las Facultades"
          options={opcionesFacultades} 
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
        <div className="loading-container">Cargando carreras...</div>
      ) : (
        <Table columns={columns} data={carreras} actions={renderActions} />
      )}

      <ModalGeneral
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={
          modalState.type === 'add' ? 'Registrar Carrera' : 
          modalState.type === 'edit' ? 'Editar Carrera' : 
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
              <button className="btn-save" onClick={() => handleSaveCarrera(formData)}>Guardar</button>
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
              ¿Estás seguro de que deseas <strong>{formData?.activo ? 'dar de baja' : 'reactivar'}</strong> la carrera <strong>{formData?.nombre}</strong>?
            </p>
          </div>
        ) : (
          formData && (
            <>
              <div className="form-row">
                <div className="form-group-modal full-width">
                  <label>Facultad a la que pertenece</label>
                  <select 
                    name="id_facultad" 
                    value={formData.id_facultad || ''} 
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">-- Seleccione una Facultad --</option>
                    {facultades
                      .filter(fac => fac.activo || fac.id_facultad === formData.id_facultad)
                      .map(fac => (
                        <option key={fac.id_facultad} value={fac.id_facultad}>
                          {fac.nombre} {!fac.activo ? '(Inactiva)' : ''}
                        </option>
                    ))}
                    
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-modal">
                  <label>Código Carrera</label>
                  <input 
                    name="codigo" 
                    value={formData.codigo || ''} 
                    onChange={handleInputChange} 
                    placeholder="Ej. ING-SIS"
                  />
                </div>
                <div className="form-group-modal">
                  <label>Nombre Oficial</label>
                  <input 
                    name="nombre" 
                    value={formData.nombre || ''} 
                    onChange={handleInputChange} 
                    placeholder="Ej. Ingeniería en Sistemas"
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

export default GestorCarreras;
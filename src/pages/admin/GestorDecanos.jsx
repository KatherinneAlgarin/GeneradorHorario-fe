import React from 'react';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import Filtro from '../../components/common/Filtro';
import ModalGeneral from '../../components/common/ModalGeneral';
import Notification from '../../components/common/Notification';
import { useDecanos } from '../../hooks/useDecanos';
import '../../styles/AdminDashboard.css'; 

const GestorDecanos = () => {
  const { 
    decanos, facultades, columns,
    searchTerm, setSearchTerm, 
    filterEstado, setFilterEstado,
    filterFacultad, setFilterFacultad,     
    modalState, loading,
    openAddModal, openEditModal, closeModal,
    handleSaveDecano, handleInputChange, executeToggleStatus,
    notificationModal, setNotificationModal,
    notification, setNotification
  } = useDecanos();

  const formData = modalState.data;

  const renderActions = (row) => (
    <div className="action-buttons">
      <button className="btn-text-edit" onClick={() => openEditModal(row)} title="Editar Decano">Editar</button>
    </div>
  );

  const opcionesFacultades = facultades.map(f => ({
    label: f.nombre,
    value: f.id_facultad
  }));

  return (
    <div className="tab-view-container">
      <div className="filters-bar filters-bar-advanced">
        <SearchBar 
          value={searchTerm} 
          onChange={setSearchTerm} 
          placeholder="Buscar decano o correo..." 
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
            { label: 'Activos', value: 'activos' },
            { label: 'Inactivos', value: 'inactivos' }
          ]} 
        />
        <button className="btn-primary" onClick={openAddModal}>
          + Nuevo Decano
        </button>
      </div>

      {notification.show && (
        <Notification show={notification.show} message={notification.message} type={notification.type} onClose={() => setNotification({ ...notification, show: false })} />
      )}

      {loading ? (
        <div className="loading-container">Cargando decanos...</div>
      ) : (
        <Table columns={columns} data={decanos} actions={renderActions} />
      )}

      <ModalGeneral
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={
          modalState.type === 'add' ? 'Registrar Decano' : 
          modalState.type === 'edit' ? 'Editar Decano' : 'Confirmar Acción'
        }
        footer={
          modalState.type === 'confirmToggle' ? (
            <>
              <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
              <button className="btn-text-delete" onClick={executeToggleStatus}>Confirmar</button>
            </>
          ) : (
            <>
              <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
              <button className="btn-save" onClick={() => handleSaveDecano(formData)}>Guardar</button>
            </>
          )
        }
      >
        {notificationModal.show && modalState.isOpen && (
          <Notification show={notificationModal.show} message={notificationModal.message} type={notificationModal.type} onClose={() => setNotificationModal({ ...notificationModal, show: false })} />
        )}
        
        {modalState.type === 'confirmToggle' ? (
          <div className="confirm-text">
            <p>¿Estás seguro de que deseas <strong>{formData?.activo ? 'dar de baja' : 'reactivar'}</strong> al decano <strong>{formData?.nombre}</strong>?</p>
          </div>
        ) : (
          formData && (
            <>
              <h4 className="modal-section-title">Información Personal</h4>
              <div className="form-row">
                <div className="form-group-modal">
                  <label>Nombres</label>
                  <input name="nombres" value={formData.nombres || ''} onChange={handleInputChange} placeholder="Ej. Ana María" />
                </div>
                <div className="form-group-modal">
                  <label>Apellidos</label>
                  <input name="apellidos" value={formData.apellidos || ''} onChange={handleInputChange} placeholder="Ej. López" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-modal full-width">
                  <label>Correo Electrónico {modalState.type === 'edit' && '(No modificable)'}</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email || ''} 
                    onChange={handleInputChange} 
                    placeholder="correo@catolica.edu.sv" 
                    disabled={modalState.type === 'edit'}
                  />
                </div>
              </div>

              <h4 className="modal-section-title">Asignación Administrativa</h4>
              <div className="form-row">
                <div className="form-group-modal full-width">
                  <label>Facultad a Cargo</label>
                  <select 
                    name="id_facultad" 
                    value={formData.id_facultad || ''} 
                    onChange={handleInputChange} 
                    className="form-select"
                  >
                    <option value="">-- Seleccione una Facultad --</option>
                    {facultades.length > 0 ? (
                      facultades
                        .filter(fac => fac.activo || (modalState.type === 'edit' && formData.id_facultad === fac.id_facultad))
                        .map(fac => (
                          <option key={fac.id_facultad} value={fac.id_facultad}>
                            {fac.nombre} {!fac.activo && '(Inactiva)'}
                          </option>
                        ))
                    ) : (
                      <option disabled>No hay facultades disponibles</option>
                    )}
                  </select>
                </div>
              </div>
            </>
          )
        )}
      </ModalGeneral>
    </div>
  );
};

export default GestorDecanos;
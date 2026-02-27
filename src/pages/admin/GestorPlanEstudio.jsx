import React from 'react';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import Filtro from '../../components/common/Filtro';
import FiltroYear from '../../components/common/FiltroYear';
import ModalGeneral from '../../components/common/ModalGeneral';
import Notification from '../../components/common/Notification';
import { usePlanEstudio } from '../../hooks/usePlanEstudio';
import '../../styles/AdminDashboard.css';

const GestorPlanes = () => {
  const {
    planes, carreras, columns,
    searchTerm, setSearchTerm,
    filterEstado, setFilterEstado,
    filterYearFrom, setFilterYearFrom,
    filterYearTo, setFilterYearTo,
    modalState, loading,
    openAddModal, openEditModal, closeModal,
    handleSavePlan, handleInputChange, executeToggleStatus,
    notification, setNotification,
    notificationModal, setNotificationModal
  } = usePlanEstudio();

  const formData = modalState.data;

  const renderActions = (row) => (
    <div className="action-buttons">
      <button 
        className="btn-text-edit" 
        onClick={() => openEditModal(row)} 
        title="Editar Plan"
      >
        Editar
      </button>
    </div>
  );

  return (
    <div className="tab-view-container">
      <div className="page-header">
        <h3 className="text-muted">Planes de Estudio</h3>
        <button className="btn-primary" onClick={openAddModal}>+ Nuevo Plan</button>
      </div>

      <div className="filters-bar" style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar plan o carrera..."
        />
        <Filtro 
          value={filterEstado} 
          onChange={setFilterEstado} 
          defaultLabel="Todos los estados"
          options={[
            { label: 'Vigentes', value: 'activos' },
            { label: 'Inactivos', value: 'inactivos' }
          ]} 
        />
        <FiltroYear 
          fromYear={filterYearFrom}
          toYear={filterYearTo}
          onFromChange={setFilterYearFrom}
          onToChange={setFilterYearTo}
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
        <div className="loading-container">Cargando información...</div>
      ) : (
        <Table columns={columns} data={planes} actions={renderActions} />
      )}

      <ModalGeneral
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={
          modalState.type === 'add' ? 'Registrar Plan de Estudio' : 
          modalState.type === 'edit' ? 'Editar Plan' : 
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
              <button className="btn-save" onClick={() => handleSavePlan(formData)}>Guardar</button>
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
              ¿Estás seguro de que deseas <strong>{formData?.vigente ? 'dar de baja' : 'reactivar'}</strong> el plan <strong>{formData?.nombre}</strong>?
            </p>
          </div>
        ) : (
          formData && (
            <>
              <div className="form-row">
                <div className="form-group-modal full-width">
                  <label>Carrera Asociada</label>
                  <select
                    name="id_carrera"
                    value={formData.id_carrera || ''}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">-- Seleccione una Carrera --</option>
                    
                    {carreras.length > 0 ? (
                      carreras
                        .filter(car => car.activo || car.id_carrera === formData.id_carrera)
                        .map(car => (
                          <option key={car.id_carrera} value={car.id_carrera}>
                            {car.nombre} {!car.activo ? '(Inactiva)' : ''}
                          </option>
                      ))
                    ) : (
                      <option disabled>No hay carreras disponibles</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-modal full-width">
                  <label>Nombre del Plan</label>
                  <input
                    name="nombre"
                    value={formData.nombre || ''}
                    onChange={handleInputChange}
                    placeholder="Ej. Plan de Formación 2024"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-modal full-width">
                  <label>Descripción (Opcional)</label>
                  <textarea
                    name="descripcion"
                    className="form-textarea"
                    value={formData.descripcion || ''}
                    onChange={handleInputChange}
                    placeholder="Breve descripción del plan..."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-modal">
                  <label>Año de Inicio</label>
                  <input
                    type="number"
                    name="fecha_inicio"
                    value={formData.fecha_inicio || ''}
                    onChange={handleInputChange}
                    placeholder="Ej. 2024"
                    min="1990"
                    onKeyDown={(e) => ['e', 'E', '+', '-', '.', ','].includes(e.key) && e.preventDefault()}
                  />
                </div>
                <div className="form-group-modal">
                  <label>Año de Fin</label>
                  <input
                    type="number"
                    name="fecha_fin"
                    value={formData.fecha_fin || ''}
                    onChange={handleInputChange}
                    placeholder="Ej. 2029"
                    min="1990"
                    onKeyDown={(e) => ['e', 'E', '+', '-', '.', ','].includes(e.key) && e.preventDefault()}
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

export default GestorPlanes;
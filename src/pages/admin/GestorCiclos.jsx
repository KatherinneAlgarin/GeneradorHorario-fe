import React from 'react';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import Filtro from '../../components/common/Filtro';
import FiltroYear  from '../../components/common/FiltroYear';
import ModalGeneral from '../../components/common/ModalGeneral';
import Notification from '../../components/common/Notification';
import { useCiclos } from '../../hooks/useCiclos';
import '../../styles/AdminDashboard.css';

const GestorCiclos = () => {
  const {
    ciclos, columns, 
    searchTerm, setSearchTerm,
    filterEstado, setFilterEstado,
    filterYearFrom, setFilterYearFrom,
    filterYearTo, setFilterYearTo,
    modalState, loading,
    openAddModal, openEditModal, closeModal,
    handleSaveCiclo, handleInputChange, 
    promptActivarCiclo, executeActivarCiclo,
    notificationModal, setNotificationModal,
    notification, setNotification
  } = useCiclos();

  const formData = modalState.data;

  const renderActions = (row) => (
    <div className="action-buttons">
      {!row.activo && (
        <button 
          className="btn-text-edit" 
          style={{ color: '#059669', borderColor: '#10b981', backgroundColor: '#ecfdf5' }}
          onClick={() => promptActivarCiclo(row.id_ciclo_academico, row.nombre)}
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

      <div className="filters-bar" style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar ciclo..."
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
        <div className="loading-container">Cargando ciclos...</div>
      ) : (
        <Table columns={columns} data={ciclos} actions={renderActions} />
      )}

      <ModalGeneral
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={
          modalState.type === 'add' ? 'Crear Nuevo Ciclo' : 
          modalState.type === 'edit' ? 'Editar Ciclo' : 
          'Confirmar Activación'
        }
        footer={
          modalState.type === 'confirmActivate' ? (
            <>
              <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
              <button 
                className="btn-save" 
                style={{ backgroundColor: '#10b981' }}
                onClick={executeActivarCiclo}
              >
                Activar Ciclo
              </button>
            </>
          ) : (
            <>
              <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
              <button className="btn-save" onClick={() => handleSaveCiclo(formData)}>Guardar</button>
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
        
        {modalState.type === 'confirmActivate' ? (
          <div style={{ padding: '20px 0', textAlign: 'center', fontSize: '1.1rem' }}>
            <p>
              ¿Estás seguro de que deseas establecer <strong>{formData?.nombre}</strong> como el <strong>único ciclo activo</strong> del sistema? 
            </p>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
              (Esto inactivará cualquier otro ciclo que esté vigente actualmente).
            </p>
          </div>
        ) : (
          formData && (
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
          )
        )}
      </ModalGeneral>
    </div>
  );
};

export default GestorCiclos;
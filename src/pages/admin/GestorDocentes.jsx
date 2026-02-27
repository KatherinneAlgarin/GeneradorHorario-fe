import React from 'react';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import Filtro from '../../components/common/Filtro';
import ModalGeneral from '../../components/common/ModalGeneral';
import Notification from '../../components/common/Notification';
import { useDocentes } from '../../hooks/useDocentes';
import '../../styles/AdminDashboard.css'; 

const GestorDocentes = () => {
  const { 
    docentes, columns,
    searchTerm, setSearchTerm, 
    filterTipo, setFilterTipo,         
    filterEstado, setFilterEstado,     
    modalState, teachingHistory, loading,
    openAddModal, openEditModal, openDetailsModal, closeModal,
    handleSaveDocente, handleInputChange,
    notificationModal, setNotificationModal,
    notification, setNotification
  } = useDocentes();

  const formData = modalState.data;

  const handleSubmit = () => handleSaveDocente(formData);

  const renderActions = (row) => (
    <div className="action-buttons">
      <button className="btn-icon view" onClick={() => openDetailsModal(row)} title="Ver Expediente">Info</button>
      <button className="btn-icon edit" onClick={() => openEditModal(row)} title="Editar">✏️</button>
    </div>
  );

  const renderModalContent = () => {
    if (modalState.type === 'details' && formData) {
      return (
        <div className="details-view">
          <div className="info-card-summary">
            <div className="info-row">
              <strong>Nombre Completo:</strong> <span>{formData.nombres} {formData.apellidos}</span>
            </div>
            <div className="info-row">
              <strong>Contrato:</strong> <span>{formData.tipo}</span>
            </div>
            <div className="info-row">
              <strong>Carga Máxima:</strong> <span>{formData.carga_maxima} Horas</span>
            </div>
            <div className="info-row">
              <strong>Estado Actual:</strong> 
              <span style={{ color: formData.activo ? 'green' : 'red', fontWeight: 'bold' }}>
                {formData.activo ? ' Activo' : ' Inactivo'}
              </span>
            </div>
          </div>

          <h4 style={{ marginTop: '20px', marginBottom: '10px', color: '#555' }}>Historial de Materias Impartidas</h4>
          
          {teachingHistory.length > 0 ? (
            <div className="history-table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Asignatura</th>
                    <th>Ciclo</th>
                  </tr>
                </thead>
                <tbody>
                  {teachingHistory.map((hist, idx) => (
                    <tr key={idx}>
                      <td>{hist.codigo}</td>
                      <td>{hist.materia}</td>
                      <td><span className="cycle-badge">{hist.ciclo}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data-text">Este docente no tiene historial de clases registrado.</p>
          )}
        </div>
      );
    }

    return (
      <>
        <div className="form-row">
          <div className="form-group-modal">
            <label>Nombres</label>
            {/* Todos usan handleInputChange ahora */}
            <input name="nombres" value={formData?.nombres || ''} onChange={handleInputChange} />
          </div>
          <div className="form-group-modal">
            <label>Apellidos</label>
            <input name="apellidos" value={formData?.apellidos || ''} onChange={handleInputChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group-modal">
            <label>Tipo Contrato</label>
            <select name="tipo" value={formData?.tipo || ''} onChange={handleInputChange} className="form-select">
              <option value="Tiempo Completo">Tiempo Completo</option>
              <option value="Hora Clase">Hora Clase</option>
            </select>
          </div>
          <div className="form-group-modal">
            <label>Carga Máx (Hrs)</label>
            <input 
              type="number" 
              name="carga_maxima" 
              value={formData?.carga_maxima ?? ''} 
              onChange={handleInputChange} 
              min="0"
              placeholder="Ej. 40"
              onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()} 
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h3 className="text-muted">Gestión de Docentes</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={openAddModal}>
            + Nuevo Docente
          </button>
        </div>
      </div>

      <div className="filters-bar" style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        <SearchBar 
          value={searchTerm} 
          onChange={setSearchTerm} 
          placeholder="Buscar docente..." 
        />
        <Filtro 
          value={filterTipo} 
          onChange={setFilterTipo} 
          defaultLabel="Todos los contratos"
          options={[
            { label: 'Tiempo Completo', value: 'Tiempo Completo' },
            { label: 'Hora Clase', value: 'Hora Clase' }
          ]} 
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
        <div className="loading-container">Cargando docentes...</div>
      ) : (
        <Table columns={columns} data={docentes} actions={renderActions} />
      )}

      <ModalGeneral
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={
          modalState.type === 'add' ? 'Registrar Docente' : 
          modalState.type === 'edit' ? 'Editar Docente' : 'Expediente del Docente'
        }
        footer={
          modalState.type === 'details' ? (
            <button className="btn-cancel" onClick={closeModal}>Cerrar Expediente</button>
          ) : (
            <>
              <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
              <button className="btn-save" onClick={handleSubmit}>Guardar</button>
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
        
        {renderModalContent()}
      </ModalGeneral>
    </div>
  );
};

export default GestorDocentes;
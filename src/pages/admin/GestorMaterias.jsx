import React from 'react';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import Filtro from '../../components/common/Filtro';
import ModalGeneral from '../../components/common/ModalGeneral';
import Notification from '../../components/common/Notification';
import { useMaterias } from '../../hooks/useMaterias';
import '../../styles/AdminDashboard.css';

const GestorMaterias = () => {
  const { 
    materias, tiposAula, planes, ciclos, columns, 
    searchTerm, setSearchTerm, 
    filterTipoAula, setFilterTipoAula,
    filterEstado, setFilterEstado,
    modalState, loading,
    openAddModal, openEditModal, closeModal, 
    handleSaveMateria, handleInputChange, executeToggleStatus,
    notificationModal, setNotificationModal,
    notification, setNotification
  } = useMaterias();

  const formData = modalState.data;

  const renderActions = (row) => (
    <div className="action-buttons">
      <button 
        className="btn-text-edit" 
        onClick={() => openEditModal(row)} 
        title="Editar Materia"
      >
        Editar
      </button>
    </div>
  );

  const opcionesTiposAula = tiposAula.map(t => ({
    label: t.nombre,
    value: t.id_tipo_aula
  }));

  return (
    <div className="tab-view-container">
      <div className="page-header">
        <h3 className="text-muted">Catálogo de Materias</h3>
        <button className="btn-primary" onClick={openAddModal}>+ Nueva Materia</button>
      </div>

      <div className="filters-bar" style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        <SearchBar 
          value={searchTerm} 
          onChange={setSearchTerm} 
          placeholder="Buscar por código o nombre..." 
        />
        <Filtro 
          value={filterTipoAula} 
          onChange={setFilterTipoAula} 
          defaultLabel="Todos los tipos de aula"
          options={opcionesTiposAula} 
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
        <div className="loading-container">Cargando materias...</div>
      ) : (
        <Table columns={columns} data={materias} actions={renderActions} />
      )}

      <ModalGeneral
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={
          modalState.type === 'add' ? 'Registrar Materia' : 
          modalState.type === 'edit' ? 'Editar Materia' : 
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
              <button className="btn-save" onClick={() => handleSaveMateria(formData)}>Guardar</button>
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
              ¿Estás seguro de que deseas <strong>{formData?.activo ? 'dar de baja' : 'reactivar'}</strong> la materia <strong>{formData?.nombre}</strong>?
            </p>
          </div>
        ) : (
          formData && (
            <div key={formData.id_asignatura || 'nueva-materia'}>
              <div className="form-row">
                <div className="form-group-modal">
                  <label>Código</label>
                  <input name="codigo" value={formData.codigo || ''} onChange={handleInputChange} placeholder="Ej. MAT101" />
                </div>
                <div className="form-group-modal">
                  <label>Nombre de la Materia</label>
                  <input name="nombre" value={formData.nombre || ''} onChange={handleInputChange} placeholder="Ej. Matemática I" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-modal">
                  <label>Plan de Estudios</label>
                  <select 
                    name="id_plan_estudio" 
                    value={formData.id_plan_estudio || ''} 
                    onChange={handleInputChange} 
                    className="form-select"
                  >
                    <option value="">-- Seleccione Plan --</option>
                    {planes.length > 0 ? (
                      planes
                        .filter(p => p.vigente || p.id_plan_estudio === formData.id_plan_estudio)
                        .map(p => (
                          <option key={p.id_plan_estudio} value={p.id_plan_estudio}>
                            {p.nombre} {!p.vigente ? '(Inactivo)' : ''}
                          </option>
                      ))
                    ) : (
                      <option disabled>No hay planes disponibles</option>
                    )}
                  </select>
                </div>

                <div className="form-group-modal">
                  <label>Ciclo Recomendado</label>
                  <select 
                    name="ciclo_recomendado" 
                    value={formData.ciclo_recomendado || ''} 
                    onChange={handleInputChange} 
                    className="form-select"
                  >
                    <option value="">-- Seleccione Ciclo --</option>
                    {ciclos.map((c, index) => (
                      <option key={c.id_ciclo_academico} value={index + 1}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-modal full-width">
                  <label>Tipo de Aula Requerida</label>
                  <select name="requiere_tipo_aula" value={formData.requiere_tipo_aula || ''} onChange={handleInputChange} className="form-select">
                    <option value="">-- Seleccione Tipo de Aula --</option>
                    {tiposAula.map(tipo => (
                      <option key={tipo.id_tipo_aula} value={tipo.id_tipo_aula}>{tipo.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-modal">
                  <label>Horas Teóricas</label>
                  <input 
                    type="number" 
                    name="horas_teoricas" 
                    value={formData.horas_teoricas} 
                    onChange={handleInputChange} 
                    min="0"
                    placeholder="Ej. 4"
                    onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                  />
                </div>
                <div className="form-group-modal">
                  <label>Horas Prácticas</label>
                  <input 
                    type="number" 
                    name="horas_practicas" 
                    value={formData.horas_practicas} 
                    onChange={handleInputChange} 
                    min="0"
                    placeholder="Ej. 2"
                    onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                  />
                </div>
              </div>
            </div>
          )
        )}
      </ModalGeneral>
    </div>
  );
};

export default GestorMaterias;
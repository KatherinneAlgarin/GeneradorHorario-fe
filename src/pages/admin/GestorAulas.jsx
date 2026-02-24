import React from 'react';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import ModalGeneral from '../../components/common/ModalGeneral'; 
import { useAulas } from '../../hooks/useAulas';
import '../../styles/AdminDashboard.css';

const GestorAulas = () => {
  const { 
    aulas, 
    tipos = [],
    equipos = [],
    columns, 
    searchTerm, setSearchTerm, 
    modalState, 
    equipModal,
    closeEquipModal,
    openAddModal, openEditModal, closeModal, 
    handleSaveAula,
    handleInputChange,
    deleteAula,
    loading
  } = useAulas();

  const formData = modalState.data;

  const handleCheckboxChange = (id_equipamiento) => {
    const id = parseInt(id_equipamiento);
    setModalState(prev => {
      const currentIds = prev.data.equipamiento_ids || [];
      if (currentIds.includes(id)) {
        return { ...prev, data: { ...prev.data, equipamiento_ids: currentIds.filter(itemId => itemId !== id) } };
      } else {
        return { ...prev, data: { ...prev.data, equipamiento_ids: [...currentIds, id] } };
      }
    });
  };

  const renderActions = (row) => (
    <div className="action-buttons">
      <button className="btn-icon edit" onClick={() => openEditModal(row)} title="Editar Aula">✏️</button>
      <button className="btn-icon delete" onClick={() => deleteAula(row.id_aula)} title="Eliminar">🗑️</button>
    </div>
  );

  return (
    <div className="tab-view-container">
      <div className="page-header">
        <h3 className="text-muted">Gestión de Aulas</h3>
        <button className="btn-primary" onClick={openAddModal}>+ Nueva Aula</button>
      </div>

      <div className="filters-bar">
        <SearchBar 
          value={searchTerm} 
          onChange={setSearchTerm} 
          placeholder="Buscar por nombre, edificio o tipo..." 
        />
      </div>

      {loading ? (
        <p>Cargando aulas...</p>
      ) : (
        <Table 
          columns={columns} 
          data={aulas} 
          actions={renderActions} 
        />
      )}

      <ModalGeneral
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.type === 'add' ? 'Registrar Aula' : 'Editar Aula'}
        footer={
          <>
            <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
            <button className="btn-save" onClick={() => handleSaveAula(formData)}>Guardar</button>
          </>
        }
      >
        {formData && (
          <>
            <div className="form-row">
              <div className="form-group-modal">
                <label>Nombre / Número</label>
                <input name="nombre" value={formData.nombre || ''} onChange={handleInputChange} placeholder="Ej. A-201" />
              </div>
              <div className="form-group-modal">
                <label>Edificio</label>
                <input name="edificio" value={formData.edificio || ''} onChange={handleInputChange} placeholder="Ej. B" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group-modal">
                <label>Ubicación</label>
                <select 
                    name="ubicacion" 
                    value={formData.ubicacion || ''} 
                    onChange={handleInputChange} 
                    className="form-select"
                >
                    <option value="Campus">Campus</option>
                    <option value="Fuera de Campus">Fuera de Campus</option>
                </select>
              </div>
              <div className="form-group-modal">
                <label>Capacidad</label>
                <input type="number" name="capacidad" value={formData.capacidad || ''} onChange={handleInputChange} min="1" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group-modal full-width">
                <label>Tipo de Aula</label>
                <select name="id_tipo_aula" value={formData.id_tipo_aula || ''} onChange={handleInputChange} className="form-select">
                  <option value="">-- Seleccione Tipo --</option>
                  {tipos && tipos.map(t => (
                    <option key={t.id_tipo_aula} value={t.id_tipo_aula}>{t.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group-modal full-width">
                <label>Equipamiento Disponible</label>
                <div className="checkbox-grid">
                  {equipos && equipos.length > 0 ? (
                    equipos.map(eq => (
                      <label key={eq.id_equipamiento} className="checkbox-label">
                        <input 
                          type="checkbox"
                          checked={formData.equipamiento_ids ? formData.equipamiento_ids.includes(eq.id_equipamiento) : false}
                          onChange={() => handleCheckboxChange(eq.id_equipamiento)}
                        />
                        {eq.nombre}
                      </label>
                    ))
                  ) : (
                    <span style={{color: '#999'}}>No hay equipos.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group-modal checkbox-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleInputChange}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <span>Aula Activa</span>
                </label>
              </div>
            </div>
          </>
        )}
      </ModalGeneral>

      <ModalGeneral
        isOpen={equipModal.isOpen}
        onClose={closeEquipModal}
        title={`Equipamiento: ${equipModal.aulaNombre}`}
        footer={<button className="btn-primary" onClick={closeEquipModal}>Cerrar</button>}
      >
        <div className="equip-list-container">
            {equipModal.listaEquipos.length > 0 ? (
                <ul className="equip-list">
                    {equipModal.listaEquipos.map((nombre, idx) => (
                        <li key={idx}>{nombre}</li>
                    ))}
                </ul>
            ) : (
                <p style={{textAlign: 'center', color: '#666', padding: '20px'}}>
                    Este aula no tiene equipamiento registrado.
                </p>
            )}
        </div>
      </ModalGeneral>
    </div>
  );
};

export default GestorAulas;
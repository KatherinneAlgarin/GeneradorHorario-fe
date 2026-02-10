import React, { useState, useEffect } from 'react';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import ModalGeneral from '../../components/common/ModalGeneral';
import { usePlanEstudio } from '../../hooks/usePlanEstudio';
import '../../styles/AdminDashboard.css';

const GestorPlanes = () => {
  const { planes, carreras, searchTerm, setSearchTerm, modalState, openAddModal, openEditModal, closeModal, handleSavePlan, deletePlan, toggleStatus } = usePlanEstudio();
  const [formData, setFormData] = useState(null);

  useEffect(() => { if (modalState.isOpen) setFormData(modalState.data); }, [modalState]);

  const columns = [
    { header: 'Nombre Plan', accessor: 'nombre' },
    { header: 'Carrera', accessor: 'id_carrera', render: (row) => carreras.find(c => c.id_carrera === row.id_carrera)?.nombre || 'N/A' },
    { header: 'Vigencia', accessor: 'anio_vigencia' },
    { header: 'Estado', accessor: 'activo', render: (row) => (
        <span className={`status-badge ${row.activo ? 'status-active' : 'status-inactive'}`} onClick={() => toggleStatus(row.id_plan)} style={{cursor:'pointer'}}>
          {row.activo ? 'Vigente' : 'Obsoleto'}
        </span>
      )}
  ];

  const renderActions = (row) => (
    <div className="action-buttons">
      <button className="btn-icon edit" onClick={() => openEditModal(row)}>✏️</button>
      <button className="btn-icon delete" onClick={() => deletePlan(row.id_plan)}>🗑️</button>
    </div>
  );

  return (
    <div className="tab-view-container">
      <div className="page-header" style={{marginTop:'20px'}}>
        <h3 style={{color:'#555'}}>Planes de Estudio</h3>
        <button className="btn-primary" onClick={openAddModal}>+ Nuevo Plan</button>
      </div>
      <div className="filters-bar"><SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar plan o carrera..." /></div>
      <Table columns={columns} data={planes} actions={renderActions} />

      <ModalGeneral isOpen={modalState.isOpen} onClose={closeModal} title={modalState.type === 'add' ? 'Nuevo Plan' : 'Editar Plan'} footer={<><button className="btn-cancel" onClick={closeModal}>Cancelar</button><button className="btn-save" onClick={() => handleSavePlan(formData)}>Guardar</button></>}>
        {formData && (
          <>
            <div className="form-row">
              <div className="form-group-modal"><label>Nombre del Plan</label><input value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} placeholder="Ej. Plan 2024" /></div>
              <div className="form-group-modal"><label>Año Vigencia</label><input type="number" value={formData.anio_vigencia} onChange={e => setFormData({...formData, anio_vigencia: e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div className="form-group-modal" style={{width:'100%'}}>
                <label>Carrera Asociada</label>
                <select value={formData.id_carrera} onChange={e => setFormData({...formData, id_carrera: e.target.value})}>
                  <option value="">-- Seleccione Carrera --</option>
                  {carreras.map(c => <option key={c.id_carrera} value={c.id_carrera}>{c.nombre}</option>)}
                </select>
              </div>
            </div>
          </>
        )}
      </ModalGeneral>
    </div>
  );
};
export default GestorPlanes;
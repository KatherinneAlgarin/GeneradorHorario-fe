import React, { useState, useEffect } from 'react';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import ModalGeneral from '../../components/common/ModalGeneral';
import { useCarreras } from '../../hooks/useCarreras';
import '../../styles/AdminDashboard.css';

const GestorCarreras = () => {
  const { carreras, facultades, searchTerm, setSearchTerm, modalState, openAddModal, openEditModal, closeModal, handleSaveCarrera, deleteCarrera, toggleStatus } = useCarreras();
  const [formData, setFormData] = useState(null);

  useEffect(() => { if (modalState.isOpen) setFormData(modalState.data); }, [modalState]);

  const columns = [
    { header: 'Carrera', accessor: 'nombre' },
    { 
      header: 'Facultad', accessor: 'id_facultad',
      render: (row) => facultades.find(f => f.id_facultad === row.id_facultad)?.nombre || 'N/A'
    },
    { header: 'Duración (Años)', accessor: 'duracion' },
    { header: 'Estado', accessor: 'activo', render: (row) => (
        <span className={`status-badge ${row.activo ? 'status-active' : 'status-inactive'}`} onClick={() => toggleStatus(row.id_carrera)} style={{cursor:'pointer'}}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      )}
  ];

  const renderActions = (row) => (
    <div className="action-buttons">
      <button className="btn-icon edit" onClick={() => openEditModal(row)}>✏️</button>
      <button className="btn-icon delete" onClick={() => deleteCarrera(row.id_carrera)}>🗑️</button>
    </div>
  );

  return (
    <div className="tab-view-container">
      <div className="page-header" style={{marginTop:'20px'}}>
        <h3 style={{color:'#555'}}>Carreras Universitarias</h3>
        <button className="btn-primary" onClick={openAddModal}>+ Nueva Carrera</button>
      </div>
      <div className="filters-bar"><SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar carrera..." /></div>
      <Table columns={columns} data={carreras} actions={renderActions} />

      <ModalGeneral isOpen={modalState.isOpen} onClose={closeModal} title={modalState.type === 'add' ? 'Nueva Carrera' : 'Editar Carrera'} footer={<><button className="btn-cancel" onClick={closeModal}>Cancelar</button><button className="btn-save" onClick={() => handleSaveCarrera(formData)}>Guardar</button></>}>
        {formData && (
          <>
            <div className="form-row">
              <div className="form-group-modal"><label>Nombre Carrera</label><input value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} /></div>
              <div className="form-group-modal"><label>Duración (Años)</label><input type="number" value={formData.duracion} onChange={e => setFormData({...formData, duracion: e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div className="form-group-modal" style={{width:'100%'}}>
                <label>Facultad</label>
                <select value={formData.id_facultad} onChange={e => setFormData({...formData, id_facultad: e.target.value})}>
                  <option value="">-- Seleccione --</option>
                  {facultades.map(f => <option key={f.id_facultad} value={f.id_facultad}>{f.nombre}</option>)}
                </select>
              </div>
            </div>
          </>
        )}
      </ModalGeneral>
    </div>
  );
};
export default GestorCarreras;
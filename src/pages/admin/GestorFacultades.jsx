import React, { useState, useEffect } from 'react';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import ModalGeneral from '../../components/common/ModalGeneral';
import { useFacultades } from '../../hooks/useFacultades';
import '../../styles/AdminDashboard.css';

const GestorFacultades = () => {
  const { facultades, searchTerm, setSearchTerm, modalState, openAddModal, openEditModal, closeModal, handleSaveFacultad, deleteFacultad, toggleStatus } = useFacultades();
  const [formData, setFormData] = useState(null);

  useEffect(() => { if (modalState.isOpen) setFormData(modalState.data); }, [modalState]);

  const columns = [
    { header: 'Código', accessor: 'codigo' },
    { header: 'Nombre Facultad', accessor: 'nombre' },
    { header: 'Estado', accessor: 'activo', render: (row) => (
        <span className={`status-badge ${row.activo ? 'status-active' : 'status-inactive'}`} onClick={() => toggleStatus(row.id_facultad)} style={{cursor:'pointer'}}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      )}
  ];

  const renderActions = (row) => (
    <div className="action-buttons">
      <button className="btn-icon edit" onClick={() => openEditModal(row)}>✏️</button>
      <button className="btn-icon delete" onClick={() => deleteFacultad(row.id_facultad)}>🗑️</button>
    </div>
  );

  return (
    <div className="tab-view-container">
      <div className="page-header" style={{marginTop:'20px'}}>
        <h3 style={{color:'#555'}}>Facultades</h3>
        <button className="btn-primary" onClick={openAddModal}>+ Nueva Facultad</button>
      </div>
      <div className="filters-bar"><SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar facultad..." /></div>
      <Table columns={columns} data={facultades} actions={renderActions} />
      
      <ModalGeneral isOpen={modalState.isOpen} onClose={closeModal} title={modalState.type === 'add' ? 'Nueva Facultad' : 'Editar Facultad'} footer={<><button className="btn-cancel" onClick={closeModal}>Cancelar</button><button className="btn-save" onClick={() => handleSaveFacultad(formData)}>Guardar</button></>}>
        {formData && (
          <div className="form-row">
            <div className="form-group-modal"><label>Código</label><input value={formData.codigo} onChange={e => setFormData({...formData, codigo: e.target.value})} placeholder="Ej. ING" /></div>
            <div className="form-group-modal"><label>Nombre</label><input value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} placeholder="Ej. Ingeniería" /></div>
          </div>
        )}
      </ModalGeneral>
    </div>
  );
};
export default GestorFacultades;
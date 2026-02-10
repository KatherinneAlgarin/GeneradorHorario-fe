import React, { useState, useEffect } from 'react';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import ModalGeneral from '../../components/common/ModalGeneral';
import { useMaterias } from '../../hooks/useMaterias';
import '../../styles/AdminDashboard.css';

const GestorMaterias = () => {
  const { materias, searchTerm, setSearchTerm, modalState, openAddModal, openEditModal, closeModal, handleSaveMateria, deleteMateria, toggleStatus } = useMaterias();
  const [formData, setFormData] = useState(null);

  useEffect(() => { if (modalState.isOpen) setFormData(modalState.data); }, [modalState]);

  const columns = [
    { header: 'Código', accessor: 'codigo' },
    { header: 'Asignatura', accessor: 'nombre' },
    { header: 'UV', accessor: 'uv' },
    { header: 'Tipo', accessor: 'tipo' },
    { header: 'Estado', accessor: 'activo', render: (row) => (
        <span className={`status-badge ${row.activo ? 'status-active' : 'status-inactive'}`} onClick={() => toggleStatus(row.id_materia)} style={{cursor:'pointer'}}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      )}
  ];

  const renderActions = (row) => (
    <div className="action-buttons">
      <button className="btn-icon edit" onClick={() => openEditModal(row)}>✏️</button>
      <button className="btn-icon delete" onClick={() => deleteMateria(row.id_materia)}>🗑️</button>
    </div>
  );

  return (
    <div className="tab-view-container">
      <div className="page-header" style={{marginTop:'20px'}}>
        <h3 style={{color:'#555'}}>Catálogo de Materias</h3>
        <button className="btn-primary" onClick={openAddModal}>+ Nueva Materia</button>
      </div>
      <div className="filters-bar"><SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar materia..." /></div>
      <Table columns={columns} data={materias} actions={renderActions} />

      <ModalGeneral isOpen={modalState.isOpen} onClose={closeModal} title={modalState.type === 'add' ? 'Nueva Materia' : 'Editar Materia'} footer={<><button className="btn-cancel" onClick={closeModal}>Cancelar</button><button className="btn-save" onClick={() => handleSaveMateria(formData)}>Guardar</button></>}>
        {formData && (
          <>
            <div className="form-row">
              <div className="form-group-modal"><label>Código</label><input value={formData.codigo} onChange={e => setFormData({...formData, codigo: e.target.value})} placeholder="Ej. MAT101" /></div>
              <div className="form-group-modal"><label>Nombre</label><input value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div className="form-group-modal"><label>Unidades Valorativas (UV)</label><input type="number" value={formData.uv} onChange={e => setFormData({...formData, uv: e.target.value})} /></div>
              <div className="form-group-modal"><label>Tipo</label>
                <select value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                  <option value="Teórica">Teórica</option>
                  <option value="Práctica">Práctica</option>
                  <option value="Laboratorio">Laboratorio</option>
                </select>
              </div>
            </div>
          </>
        )}
      </ModalGeneral>
    </div>
  );
};
export default GestorMaterias;
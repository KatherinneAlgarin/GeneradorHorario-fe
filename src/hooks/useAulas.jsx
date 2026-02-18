import React, { useState, useMemo } from 'react';

const MOCK_TIPOS = [
  { id_tipo_aula: 1, nombre: 'Aula Teórica Común' },
  { id_tipo_aula: 2, nombre: 'Laboratorio de Cómputo' },
  { id_tipo_aula: 3, nombre: 'Laboratorio de Ciencias' },
  { id_tipo: 4, nombre: 'Taller de Arquitectura' }
];

const MOCK_EQUIPOS = [
  { id_equipamiento: 1, nombre: 'Proyector Multimedia' },
  { id_equipamiento: 2, nombre: 'Aire Acondicionado' },
  { id_equipamiento: 3, nombre: 'Pizarra Inteligente' },
  { id_equipamiento: 4, nombre: 'Computadora Instructor' },
  { id_equipamiento: 5, nombre: 'Escritorio Docente' }
];

const INITIAL_AULAS = [
  { 
    id_aula: 1, 
    nombre: 'A-201', 
    edificio: 'B', 
    ubicacion: 'Campus',
    capacidad: 40, 
    id_tipo_aula: 1, 
    equipamiento_ids: [1, 2, 5], 
    activo: true 
  },
  { 
    id_aula: 2, 
    nombre: 'AGRO-FIELD', 
    edificio: 'N/A', 
    ubicacion: 'Fuera de Campus',
    capacidad: 25, 
    id_tipo_aula: 3, 
    equipamiento_ids: [1, 2, 4, 5], 
    activo: true 
  }
];

export const useAulas = () => {
  const [aulas, setAulas] = useState(INITIAL_AULAS);
  const [tipos] = useState(MOCK_TIPOS);
  const [equipos] = useState(MOCK_EQUIPOS);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'add',
    data: null
  });

  const [equipModal, setEquipModal] = useState({
    isOpen: false,
    aulaNombre: '',
    listaEquipos: []
  });


  const toggleStatus = (id) => {
    setAulas(aulas.map(a => a.id_aula === id ? { ...a, activo: !a.activo } : a));
  };

  const openEquipamientoModal = (row) => {
    const nombres = row.equipamiento_ids.map(id => {
        const eq = equipos.find(e => e.id_equipamiento === parseInt(id));
        return eq ? eq.nombre : null;
    }).filter(Boolean);

    setEquipModal({
        isOpen: true,
        aulaNombre: row.nombre,
        listaEquipos: nombres
    });
  };

  const closeEquipModal = () => setEquipModal({ isOpen: false, aulaNombre: '', listaEquipos: [] });


  const columns = useMemo(() => [
    { header: 'Aula', accessor: 'nombre' },
    { header: 'Edificio', accessor: 'edificio' },
    { header: 'Ubicación', accessor: 'ubicacion' },
    { header: 'Capacidad', accessor: 'capacidad' },
    { 
      header: 'Tipo', 
      accessor: 'id_tipo_aula',
      render: (row) => {
        const tipo = tipos.find(t => t.id_tipo_aula === parseInt(row.id_tipo_aula));
        return tipo ? tipo.nombre : '---';
      }
    },
    { 
      header: 'Equipamiento', 
      accessor: 'equipamiento_ids',
      render: (row) => (
        <button 
          className="btn-view-details"
          onClick={() => openEquipamientoModal(row)}
        >
          Ver Detalle
        </button>
      )
    },
    { 
      header: 'Estado', 
      accessor: 'activo',
      render: (row) => (
        <span 
          className={`status-badge ${row.activo ? 'status-active' : 'status-inactive'} cursor-pointer`}
          onClick={() => toggleStatus(row.id_aula)}
        >
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    }
  ], [aulas, tipos, equipos]);


  const filteredAulas = useMemo(() => {
    if (!searchTerm) return aulas;
    const lower = searchTerm.toLowerCase();
    
    return aulas.filter(a => {
      const nombreTipo = tipos.find(t => t.id_tipo_aula === parseInt(a.id_tipo_aula))?.nombre.toLowerCase() || '';
      return (
        a.nombre.toLowerCase().includes(lower) || 
        a.edificio.toLowerCase().includes(lower) ||
        a.ubicacion.toLowerCase().includes(lower) ||
        nombreTipo.includes(lower)
      );
    });
  }, [aulas, tipos, searchTerm]);

  const handleSaveAula = (formData) => {
    if (!formData.nombre || !formData.edificio || !formData.id_tipo_aula || !formData.capacidad || !formData.ubicacion) {
      return alert("Complete los campos obligatorios.");
    }

    const dataToSave = {
      ...formData,
      id_tipo_aula: parseInt(formData.id_tipo_aula),
      capacidad: parseInt(formData.capacidad),
      equipamiento_ids: formData.equipamiento_ids ? formData.equipamiento_ids.map(id => parseInt(id)) : []
    };

    if (modalState.type === 'add') {
      const maxId = aulas.length > 0 ? Math.max(...aulas.map(a => a.id_aula)) : 0;
      setAulas([...aulas, { ...dataToSave, id_aula: maxId + 1, activo: true }]);
    } else {
      setAulas(aulas.map(a => a.id_aula === dataToSave.id_aula ? dataToSave : a));
    }
    closeModal();
  };

  const openAddModal = () => {
    setModalState({ 
      isOpen: true, type: 'add', 
      data: { nombre: '', edificio: '', ubicacion: 'Campus', capacidad: 30, id_tipo_aula: '', equipamiento_ids: [], activo: true } 
    });
  };

  const openEditModal = (item) => setModalState({ isOpen: true, type: 'edit', data: { ...item } });
  const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  return {
    aulas: filteredAulas, 
    tipos,
    equipos,
    columns,
    searchTerm, setSearchTerm,
    modalState,
    equipModal,
    openAddModal, openEditModal, closeModal,
    closeEquipModal,
    handleSaveAula
  };
};
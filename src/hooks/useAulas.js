import { useState, useMemo } from 'react';

const initialTiposAula = [
  { id_tipo: 1, nombre: 'Aula Teórica' },
  { id_tipo: 2, nombre: 'Laboratorio de Cómputo' },
  { id_tipo: 3, nombre: 'Laboratorio de Ciencias' },
  { id_tipo: 4, nombre: 'Auditorio' },
  { id_tipo: 5, nombre: 'Sala de Reuniones' }
];

const initialAulas = [
  { id_aula: 'a1', nombre: 'A-101', capacidad: 40, id_tipo_aula: 1, equipamiento: 'Proyector, Aire Acondicionado', ubicacion: 'Edificio A', activo: true },
  { id_aula: 'a2', nombre: 'LAB-01', capacidad: 25, id_tipo_aula: 2, equipamiento: '25 PCs, Proyector, Internet', ubicacion: 'Edificio C', activo: true },
  { id_aula: 'a3', nombre: 'AUD-MAG', capacidad: 100, id_tipo_aula: 4, equipamiento: 'Sonido, Escenario, Proyector HD', ubicacion: 'Edificio Central', activo: false },
];

export const useAulas = () => {
  const [aulas, setAulas] = useState(initialAulas);
  const [tiposAula] = useState(initialTiposAula);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'add',
    data: null
  });

  const filteredAulas = useMemo(() => {
    if (!searchTerm) return aulas;
    const lowerSearch = searchTerm.toLowerCase();
    
    return aulas.filter(aula => {
      const nombreTipo = tiposAula.find(t => t.id_tipo === parseInt(aula.id_tipo_aula))?.nombre.toLowerCase() || '';
      
      return (
        aula.nombre.toLowerCase().includes(lowerSearch) ||
        nombreTipo.includes(lowerSearch) || 
        aula.equipamiento.toLowerCase().includes(lowerSearch) ||
        aula.ubicacion.toLowerCase().includes(lowerSearch)
      );
    });
  }, [aulas, tiposAula, searchTerm]);

  const validateAula = (formData) => {
    if (!formData.nombre || formData.nombre.trim() === "") return "El nombre/número del aula es obligatorio.";
    if (formData.capacidad <= 0) return "La capacidad debe ser mayor a 0.";
    if (!formData.id_tipo_aula) return "Debes seleccionar un tipo de aula.";
    return null;
  };

  const handleSaveAula = (formData) => {
    const error = validateAula(formData);
    if (error) {
      alert(error);
      return;
    }

    const dataToSave = { ...formData, id_tipo_aula: parseInt(formData.id_tipo_aula) };

    if (modalState.type === 'add') {
      const newAula = { ...dataToSave, id_aula: crypto.randomUUID(), activo: true };
      setAulas([...aulas, newAula]);
    } else {
      setAulas(aulas.map(a => a.id_aula === dataToSave.id_aula ? dataToSave : a));
    }
    closeModal();
  };

  const deleteAula = (id) => {
    if(window.confirm("¿Estás seguro de eliminar esta aula?")) {
      setAulas(aulas.filter(a => a.id_aula !== id));
    }
  };

  const toggleStatus = (id) => {
    setAulas(aulas.map(a => a.id_aula === id ? { ...a, activo: !a.activo } : a));
  };

  const openAddModal = () => {
    setModalState({ 
      isOpen: true, type: 'add', 
      data: { nombre: '', capacidad: 30, id_tipo_aula: '', equipamiento: '', ubicacion: '', activo: true } 
    });
  };

  const openEditModal = (aula) => {
    setModalState({ isOpen: true, type: 'edit', data: { ...aula } });
  };

  const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  return {
    aulas: filteredAulas,
    tiposAula,
    searchTerm, setSearchTerm,
    modalState,
    openAddModal, openEditModal, closeModal,
    handleSaveAula, deleteAula, toggleStatus
  };
};
import { useState, useMemo } from 'react';

const initialFacultades = [
  { id_facultad: 'f1', nombre: 'Facultad de Ingeniería', codigo: 'ING', activo: true },
  { id_facultad: 'f2', nombre: 'Facultad de Medicina', codigo: 'MED', activo: true },
  { id_facultad: 'f3', nombre: 'Facultad de Humanidades', codigo: 'HUM', activo: true },
];

export const useFacultades = () => {
  const [facultades, setFacultades] = useState(initialFacultades);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalState, setModalState] = useState({ isOpen: false, type: 'add', data: null });

  const filteredFacultades = useMemo(() => {
    if (!searchTerm) return facultades;
    const lower = searchTerm.toLowerCase();
    return facultades.filter(f => 
      f.nombre.toLowerCase().includes(lower) || f.codigo.toLowerCase().includes(lower)
    );
  }, [facultades, searchTerm]);

  const handleSaveFacultad = (formData) => {
    if (!formData.nombre || !formData.codigo) return alert("Nombre y Código son obligatorios");

    if (modalState.type === 'add') {
      setFacultades([...facultades, { ...formData, id_facultad: crypto.randomUUID(), activo: true }]);
    } else {
      setFacultades(facultades.map(f => f.id_facultad === formData.id_facultad ? formData : f));
    }
    closeModal();
  };

  const deleteFacultad = (id) => {
    if (window.confirm("¿Eliminar facultad?")) setFacultades(facultades.filter(f => f.id_facultad !== id));
  };

  const toggleStatus = (id) => {
    setFacultades(facultades.map(f => f.id_facultad === id ? { ...f, activo: !f.activo } : f));
  };

  const openAddModal = () => setModalState({ isOpen: true, type: 'add', data: { nombre: '', codigo: '', activo: true } });
  const openEditModal = (item) => setModalState({ isOpen: true, type: 'edit', data: { ...item } });
  const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  return {
    facultades: filteredFacultades,
    searchTerm, setSearchTerm, modalState,
    openAddModal, openEditModal, closeModal,
    handleSaveFacultad, deleteFacultad, toggleStatus
  };
};
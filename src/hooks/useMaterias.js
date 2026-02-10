import { useState, useMemo } from 'react';

const initialMaterias = [
  { id_materia: 'm1', codigo: 'MAT101', nombre: 'Matemáticas I', uv: 4, tipo: 'Teórica', activo: true },
  { id_materia: 'm2', codigo: 'PROG1', nombre: 'Programación I', uv: 4, tipo: 'Práctica', activo: true },
  { id_materia: 'm3', codigo: 'FIS1', nombre: 'Física I', uv: 4, tipo: 'Teórica', activo: true },
];

export const useMaterias = () => {
  const [materias, setMaterias] = useState(initialMaterias);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalState, setModalState] = useState({ isOpen: false, type: 'add', data: null });

  const filteredMaterias = useMemo(() => {
    if (!searchTerm) return materias;
    const lower = searchTerm.toLowerCase();
    return materias.filter(m => 
      m.nombre.toLowerCase().includes(lower) || 
      m.codigo.toLowerCase().includes(lower)
    );
  }, [materias, searchTerm]);

  const handleSaveMateria = (formData) => {
    if (!formData.nombre || !formData.codigo || formData.uv <= 0) return alert("Datos inválidos");

    if (modalState.type === 'add') {
      setMaterias([...materias, { ...formData, id_materia: crypto.randomUUID(), activo: true }]);
    } else {
      setMaterias(materias.map(m => m.id_materia === formData.id_materia ? formData : m));
    }
    closeModal();
  };

  const deleteMateria = (id) => { if(window.confirm("¿Eliminar materia?")) setMaterias(materias.filter(m => m.id_materia !== id)); };
  const toggleStatus = (id) => { setMaterias(materias.map(m => m.id_materia === id ? { ...m, activo: !m.activo } : m)); };

  const openAddModal = () => setModalState({ isOpen: true, type: 'add', data: { codigo: '', nombre: '', uv: 4, tipo: 'Teórica', activo: true } });
  const openEditModal = (item) => setModalState({ isOpen: true, type: 'edit', data: { ...item } });
  const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  return { materias, searchTerm, setSearchTerm, modalState, openAddModal, openEditModal, closeModal, handleSaveMateria, deleteMateria, toggleStatus };
};
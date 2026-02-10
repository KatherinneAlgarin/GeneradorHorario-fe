import { useState, useMemo } from 'react';

// Catálogo simulado (esto vendría de la BD)
const mockFacultades = [
  { id_facultad: 'f1', nombre: 'Facultad de Ingeniería' },
  { id_facultad: 'f2', nombre: 'Facultad de Medicina' },
];

const initialCarreras = [
  { id_carrera: 'c1', nombre: 'Ing. Desarrollo de Software', id_facultad: 'f1', duracion: 5, activo: true },
  { id_carrera: 'c2', nombre: 'Doctorado en Medicina', id_facultad: 'f2', duracion: 8, activo: true },
];

export const useCarreras = () => {
  const [carreras, setCarreras] = useState(initialCarreras);
  const [facultades] = useState(mockFacultades); // Catálogo para el select
  const [searchTerm, setSearchTerm] = useState("");
  const [modalState, setModalState] = useState({ isOpen: false, type: 'add', data: null });

  const filteredCarreras = useMemo(() => {
    if (!searchTerm) return carreras;
    const lower = searchTerm.toLowerCase();
    return carreras.filter(c => 
      c.nombre.toLowerCase().includes(lower) || 
      // Buscamos también por nombre de facultad
      facultades.find(f => f.id_facultad === c.id_facultad)?.nombre.toLowerCase().includes(lower)
    );
  }, [carreras, facultades, searchTerm]);

  const handleSaveCarrera = (formData) => {
    if (!formData.nombre || !formData.id_facultad) return alert("Faltan datos obligatorios");
    
    if (modalState.type === 'add') {
      setCarreras([...carreras, { ...formData, id_carrera: crypto.randomUUID(), activo: true }]);
    } else {
      setCarreras(carreras.map(c => c.id_carrera === formData.id_carrera ? formData : c));
    }
    closeModal();
  };

  const deleteCarrera = (id) => { if(window.confirm("¿Eliminar carrera?")) setCarreras(carreras.filter(c => c.id_carrera !== id)); };
  const toggleStatus = (id) => { setCarreras(carreras.map(c => c.id_carrera === id ? { ...c, activo: !c.activo } : c)); };

  const openAddModal = () => setModalState({ isOpen: true, type: 'add', data: { nombre: '', id_facultad: '', duracion: 5, activo: true } });
  const openEditModal = (item) => setModalState({ isOpen: true, type: 'edit', data: { ...item } });
  const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  return { carreras, facultades, searchTerm, setSearchTerm, modalState, openAddModal, openEditModal, closeModal, handleSaveCarrera, deleteCarrera, toggleStatus };
};
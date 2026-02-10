import { useState, useMemo } from 'react';

// Catálogo simulado de carreras
const mockCarreras = [
  { id_carrera: 'c1', nombre: 'Ing. Desarrollo de Software' },
  { id_carrera: 'c2', nombre: 'Doctorado en Medicina' },
];

const initialPlanes = [
  { id_plan: 'p1', nombre: 'Plan 2022', id_carrera: 'c1', anio_vigencia: 2022, activo: true },
  { id_plan: 'p2', nombre: 'Plan 2018 (Antiguo)', id_carrera: 'c1', anio_vigencia: 2018, activo: false },
];

export const usePlanEstudio = () => {
  const [planes, setPlanes] = useState(initialPlanes);
  const [carreras] = useState(mockCarreras);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalState, setModalState] = useState({ isOpen: false, type: 'add', data: null });

  const filteredPlanes = useMemo(() => {
    if (!searchTerm) return planes;
    const lower = searchTerm.toLowerCase();
    return planes.filter(p => 
      p.nombre.toLowerCase().includes(lower) || 
      carreras.find(c => c.id_carrera === p.id_carrera)?.nombre.toLowerCase().includes(lower)
    );
  }, [planes, carreras, searchTerm]);

  const handleSavePlan = (formData) => {
    if (!formData.nombre || !formData.id_carrera) return alert("Faltan datos");
    if (modalState.type === 'add') {
      setPlanes([...planes, { ...formData, id_plan: crypto.randomUUID(), activo: true }]);
    } else {
      setPlanes(planes.map(p => p.id_plan === formData.id_plan ? formData : p));
    }
    closeModal();
  };

  const deletePlan = (id) => { if(window.confirm("¿Eliminar plan?")) setPlanes(planes.filter(p => p.id_plan !== id)); };
  const toggleStatus = (id) => { setPlanes(planes.map(p => p.id_plan === id ? { ...p, activo: !p.activo } : p)); };

  const openAddModal = () => setModalState({ isOpen: true, type: 'add', data: { nombre: '', id_carrera: '', anio_vigencia: new Date().getFullYear(), activo: true } });
  const openEditModal = (item) => setModalState({ isOpen: true, type: 'edit', data: { ...item } });
  const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  return { planes, carreras, searchTerm, setSearchTerm, modalState, openAddModal, openEditModal, closeModal, handleSavePlan, deletePlan, toggleStatus };
};
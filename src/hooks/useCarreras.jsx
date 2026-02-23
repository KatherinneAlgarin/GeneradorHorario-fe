import { useState, useMemo, useEffect, useCallback } from 'react';
import { apiRequest } from '../services/api';

export const useCarreras = () => {
  const [carreras, setCarreras] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'add',
    data: { codigo: '', nombre: '', descripcion: '', id_facultad: '', activo: true }
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Nota: Tu index.ts monta en /api/carreras y /api/facultades
      const [carrerasData, facultadesData] = await Promise.all([
        apiRequest('/carreras'),
        apiRequest('/facultades')
      ]);
      
      setCarreras(Array.isArray(carrerasData) ? carrerasData : []);
      setFacultades(Array.isArray(facultadesData) ? facultadesData : []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setModalState(prev => ({
      ...prev,
      data: { ...prev.data, [name]: val }
    }));
  };

  const handleSaveCarrera = async (formData) => {
    if (!formData.codigo || !formData.nombre || !formData.id_facultad) {
      return alert("Código, Nombre y Facultad son obligatorios.");
    }

    try {
      const payload = {
        nombre: formData.nombre,
        codigo: formData.codigo,
        descripcion: formData.descripcion,
        id_facultad: formData.id_facultad,
        activo: formData.activo
      };

      if (modalState.type === 'add') {
        await apiRequest('/carreras', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } else {
        // Asegúrate de tener la ruta PUT en tu backend para carreras
        await apiRequest(`/carreras/${formData.id_carrera}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      }
      await fetchData();
      closeModal();
    } catch (error) {
      error.message("Error al guardar la carrera");
    }
  };

  const columns = useMemo(() => [
    { header: 'Código', accessor: 'codigo' },
    { header: 'Nombre Carrera', accessor: 'nombre' },
    { 
      header: 'Facultad', 
      accessor: 'facultad', // Cambiado para usar el include del backend
      render: (row) => row.facultad?.nombre || '---'
    },
    { header: 'Descripción', accessor: 'descripcion' },
    { 
      header: 'Estado', 
      accessor: 'activo',
      render: (row) => (
        <span className={`status-badge ${row.activo ? 'status-active' : 'status-inactive'}`}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    }
  ], []);

  const filteredCarreras = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return carreras.filter(c => 
      c.nombre?.toLowerCase().includes(lower) || 
      c.codigo?.toLowerCase().includes(lower) ||
      c.facultad?.nombre?.toLowerCase().includes(lower)
    );
  }, [carreras, searchTerm]);

  const openAddModal = () => {
    setModalState({ 
      isOpen: true, type: 'add', 
      data: { codigo: '', nombre: '', descripcion: '', id_facultad: '', activo: true } 
    });
  };

  const openEditModal = (item) => {
    setModalState({ isOpen: true, type: 'edit', data: { ...item } });
  };

  const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  return {
    carreras: filteredCarreras,
    facultades,
    columns,
    searchTerm, setSearchTerm,
    modalState,
    openAddModal, openEditModal, closeModal,
    handleSaveCarrera,
    handleInputChange,
    loading
  };
};
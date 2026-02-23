import { useState, useMemo, useEffect, useCallback } from 'react';
import { apiRequest } from '../services/api';

export const useFacultades = () => {
  const [facultades, setFacultades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'add',
    data: { nombre: '', descripcion: '', activo: true } // Quitamos codigo
  });

  const fetchFacultades = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/facultades');
      setFacultades(data);
    } catch (error) {
      console.error("Error al cargar facultades:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFacultades();
  }, [fetchFacultades]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Si es un checkbox, usamos 'checked', de lo contrario 'value'
    const val = type === 'checkbox' ? checked : value;
    
    setModalState(prev => ({
      ...prev,
      data: { ...prev.data, [name]: val }
    }));
  };

  const handleSaveFacultad = async (formData) => {
    // Solo validamos nombre ahora
    if (!formData.nombre) {
      return alert("El nombre es obligatorio.");
    }

    try {
      if (modalState.type === 'add') {
        await apiRequest('/facultades', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      } else {
        await apiRequest(`/facultades/${formData.id_facultad}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      }
      await fetchFacultades();
      closeModal();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al procesar la solicitud");
    }
  };

  const deleteFacultad = async (id) => {
    if (window.confirm("¿Confirma eliminar esta facultad?")) {
      try {
        await apiRequest(`/facultades/${id}`, { method: 'DELETE' });
        await fetchFacultades();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  // Columnas simplificadas
  const columns = useMemo(() => [
    { header: 'Nombre Facultad', accessor: 'nombre' },
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
  ], []); // Ya no depende de toggleStatus

  const filteredFacultades = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return facultades.filter(f => 
      f.nombre?.toLowerCase().includes(lower) || 
      f.descripcion?.toLowerCase().includes(lower)
    );
  }, [facultades, searchTerm]);

  const openAddModal = () => {
    setModalState({ 
      isOpen: true, type: 'add', 
      data: { nombre: '', descripcion: '', activo: true } 
    });
  };

  const openEditModal = (item) => {
    setModalState({ isOpen: true, type: 'edit', data: { ...item } });
  };

  const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  return {
    facultades: filteredFacultades,
    columns,
    searchTerm, setSearchTerm,
    modalState,
    openAddModal, openEditModal, closeModal,
    handleSaveFacultad,
    deleteFacultad,
    handleInputChange,
    loading
  };
};
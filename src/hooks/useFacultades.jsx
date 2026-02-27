import { useState, useMemo, useEffect, useCallback } from 'react';
import { apiRequest } from '../services/api';

export const useFacultades = () => {
  const [facultades, setFacultades] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState(""); 
  
  const [notificationModal, setNotificationModal] = useState({
    show: false, message: '', type: 'error'
  });

  const [notification, setNotification] = useState({
    show: false, message: '', type: 'error'
  });
  
  const [modalState, setModalState] = useState({
    isOpen: false, type: 'add',
    data: { nombre: '', descripcion: '', activo: true }
  });

  const fetchFacultades = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/facultades');
      setFacultades(data);
    } catch (error) {
      console.error("Error al cargar facultades:", error);
      setNotification({ show: true, message: "Error al cargar las facultades.", type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFacultades();
  }, [fetchFacultades]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalState(prev => ({
      ...prev,
      data: { ...prev.data, [name]: value }
    }));
  };

  const toggleStatus = useCallback((id, currentStatus, nombre) => {
    setNotificationModal({ show: false, message: '', type: 'error' });
    setModalState({
      isOpen: true,
      type: 'confirmToggle',
      data: { id_facultad: id, activo: currentStatus, nombre: nombre }
    });
  }, []);

  const executeToggleStatus = async () => {
    const { id_facultad, activo } = modalState.data;
    const endpoint = activo ? `/facultades/desactivar/${id_facultad}` : `/facultades/activar/${id_facultad}`;

    try {
      await apiRequest(endpoint, { method: 'PUT' });
      await fetchFacultades();
      setNotification({
        show: true,
        message: activo ? "Facultad dada de baja exitosamente" : "Facultad reactivada exitosamente",
        type: 'success'
      });
      closeModal();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      setNotificationModal({
        show: true, message: error.message || "Error al cambiar el estado", type: 'error'
      });
    }
  };

  const handleSaveFacultad = async (formData) => {
    if (!formData.nombre) {
      setNotificationModal({ show: true, message: "El nombre es obligatorio.", type: 'error' });
      return;
    }

    try {
      if (modalState.type === 'add') {
        await apiRequest('/facultades', {
          method: 'POST',
          body: JSON.stringify({ nombre: formData.nombre, descripcion: formData.descripcion })
        });
        setNotificationModal({ show: true, message: "Facultad creada exitosamente", type: 'success' });
      } else {
        await apiRequest(`/facultades/actualizar/${formData.id_facultad}`, {
          method: 'PUT',
          body: JSON.stringify({ nombre: formData.nombre, descripcion: formData.descripcion })
        });
        setNotificationModal({ show: true, message: "Facultad actualizada exitosamente", type: 'success' });
      }
      await fetchFacultades();
      setTimeout(() => closeModal(), 1500);
    } catch (error) {
      console.error("Error al guardar facultad:", error);
      setNotificationModal({ show: true, message: error.message || "Error al guardar", type: 'error' });
    }
  };

  const columns = useMemo(() => [
    { header: 'Nombre Facultad', accessor: 'nombre' },
    { header: 'Descripción', accessor: 'descripcion' },
    { 
      header: 'Estado', 
      accessor: 'activo',
      render: (row) => (
        <span 
          className={`status-badge ${row.activo ? 'status-active' : 'status-inactive'} cursor-pointer`}
          onClick={() => toggleStatus(row.id_facultad, row.activo, row.nombre)}
          title={row.activo ? "Clic para dar de baja" : "Clic para reactivar"}
        >
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    }
  ], [toggleStatus]);

  const filteredFacultades = useMemo(() => {
    return facultades.filter(f => {
      const lower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        f.nombre?.toLowerCase().includes(lower) || 
        f.descripcion?.toLowerCase().includes(lower);
      
      let matchesEstado = true;
      if (filterEstado === "activos") matchesEstado = f.activo === true;
      if (filterEstado === "inactivos") matchesEstado = f.activo === false;

      return matchesSearch && matchesEstado;
    });
  }, [facultades, searchTerm, filterEstado]);

  const openAddModal = () => {
    setNotificationModal({ show: false, message: '', type: 'error' });
    setModalState({ 
      isOpen: true, type: 'add', 
      data: { nombre: '', descripcion: '', activo: true } 
    });
  };

  const openEditModal = (item) => {
    setNotificationModal({ show: false, message: '', type: 'error' });
    setModalState({ isOpen: true, type: 'edit', data: { ...item } });
  };

  const closeModal = () => {
    setNotificationModal({ show: false, message: '', type: 'error' });
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return {
    facultades: filteredFacultades, columns,
    searchTerm, setSearchTerm,
    filterEstado, setFilterEstado,
    modalState, openAddModal, openEditModal, closeModal,
    handleSaveFacultad, handleInputChange, loading,
    executeToggleStatus,
    notification, setNotification,
    notificationModal, setNotificationModal
  };
};
import { useState, useMemo, useEffect, useCallback } from 'react';
import { apiRequest } from '../services/api';

export const useCarreras = () => {
  const [carreras, setCarreras] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFacultad, setFilterFacultad] = useState(""); 
  const [filterEstado, setFilterEstado] = useState("");
  
  const [notificationModal, setNotificationModal] = useState({
    show: false, message: '', type: 'error'
  });

  const [notification, setNotification] = useState({
    show: false, message: '', type: 'error'
  });
  
  const [modalState, setModalState] = useState({
    isOpen: false, type: 'add',
    data: { codigo: '', nombre: '', descripcion: '', id_facultad: '', activo: true }
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [carrerasData, facultadesData] = await Promise.all([
        apiRequest('/carreras'),
        apiRequest('/facultades')
      ]);
      setCarreras(Array.isArray(carrerasData) ? carrerasData : []);
      setFacultades(Array.isArray(facultadesData) ? facultadesData : []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setNotification({ show: true, message: "Error al cargar las carreras y facultades.", type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      data: { id_carrera: id, activo: currentStatus, nombre: nombre }
    });
  }, []);

  const executeToggleStatus = async () => {
    const { id_carrera, activo } = modalState.data;
    const endpoint = activo ? `/carreras/desactivar/${id_carrera}` : `/carreras/activar/${id_carrera}`;

    try {
      await apiRequest(endpoint, { method: 'PUT' });
      await fetchData();
      setNotification({
        show: true,
        message: activo ? "Carrera dada de baja exitosamente" : "Carrera reactivada exitosamente",
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

  const handleSaveCarrera = async (formData) => {
    if (!formData.codigo || !formData.nombre || !formData.id_facultad) {
      setNotificationModal({ show: true, message: "Facultad, nombre y código son obligatorios.", type: 'error' });
      return;
    }

    try {
      const payload = {
        nombre: formData.nombre,
        codigo: formData.codigo,
        descripcion: formData.descripcion || "",
        id_facultad: formData.id_facultad
      };

      if (modalState.type === 'add') {
        await apiRequest('/carreras', { method: 'POST', body: JSON.stringify(payload) });
        setNotificationModal({ show: true, message: "Carrera creada exitosamente", type: 'success' });
      } else {
        await apiRequest(`/carreras/actualizar/${formData.id_carrera}`, { method: 'PUT', body: JSON.stringify(payload) });
        setNotificationModal({ show: true, message: "Carrera actualizada exitosamente", type: 'success' });
      }
      await fetchData();
      setTimeout(() => closeModal(), 1500);
    } catch (error) {
      console.error("Error al guardar carrera:", error);
      setNotificationModal({ show: true, message: error.message || "Error al procesar la solicitud", type: 'error' });
    }
  };

  const columns = useMemo(() => [
    { header: 'Código', accessor: 'codigo' },
    { header: 'Nombre Carrera', accessor: 'nombre' },
    { 
      header: 'Facultad', 
      accessor: 'facultad', 
      render: (row) => row.facultad?.nombre || '---'
    },
    { 
      header: 'Descripción', 
      accessor: 'descripcion',
      render: (row) => (
        <div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.descripcion}>
          {row.descripcion || '---'}
        </div>
      )
    },
    { 
      header: 'Estado', 
      accessor: 'activo',
      render: (row) => (
        <span 
          className={`status-badge ${row.activo ? 'status-active' : 'status-inactive'} cursor-pointer`}
          onClick={() => toggleStatus(row.id_carrera, row.activo, row.nombre)}
          title={row.activo ? "Clic para dar de baja" : "Clic para reactivar"}
        >
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    }
  ], [toggleStatus]);

 
  const filteredCarreras = useMemo(() => {
    return carreras.filter(c => {
      // 1. Filtro por  nombre o código
      const lower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        c.nombre?.toLowerCase().includes(lower) || 
        c.codigo?.toLowerCase().includes(lower);

      // filtro por facultad
      const matchesFacultad = !filterFacultad || c.id_facultad === filterFacultad;

      // filtro estado
      let matchesEstado = true;
      if (filterEstado === "activos") matchesEstado = c.activo === true;
      if (filterEstado === "inactivos") matchesEstado = c.activo === false;

      return matchesSearch && matchesFacultad && matchesEstado;
    });
  }, [carreras, searchTerm, filterFacultad, filterEstado]);

  const openAddModal = () => {
    setNotificationModal({ show: false, message: '', type: 'error' });
    setModalState({ 
      isOpen: true, type: 'add', 
      data: { codigo: '', nombre: '', descripcion: '', id_facultad: '', activo: true } 
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
    carreras: filteredCarreras, facultades, columns,
    searchTerm, setSearchTerm,
    filterFacultad, setFilterFacultad, 
    filterEstado, setFilterEstado,
    modalState, openAddModal, openEditModal, closeModal,
    handleSaveCarrera, handleInputChange, loading,
    executeToggleStatus,
    notification, setNotification,
    notificationModal, setNotificationModal
  };
};
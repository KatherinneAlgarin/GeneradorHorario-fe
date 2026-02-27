import { useState, useMemo, useEffect, useCallback } from 'react';
import { apiRequest } from '../services/api';

export const usePlanEstudio = () => {
  const [planes, setPlanes] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterYearFrom, setFilterYearFrom] = useState("");
  const [filterYearTo, setFilterYearTo] = useState("");
  
  const [notificationModal, setNotificationModal] = useState({
    show: false, message: '', type: 'error'
  });

  const [notification, setNotification] = useState({
    show: false, message: '', type: 'error'
  });
  
  const [modalState, setModalState] = useState({
    isOpen: false, type: 'add',
    data: { id_carrera: '', nombre: '', descripcion: '', fecha_inicio: '', fecha_fin: '', vigente: true }
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [planesData, carrerasData] = await Promise.all([
        apiRequest('/planes-estudio'),
        apiRequest('/carreras')
      ]);
      setPlanes(Array.isArray(planesData) ? planesData : []);
      setCarreras(Array.isArray(carrerasData) ? carrerasData : []);
    } catch (error) {
      console.error("Error al cargar datos en Planes:", error);
      setNotification({ show: true, message: "Error al cargar la información.", type: 'error' });
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
      data: { id_plan_estudio: id, vigente: currentStatus, nombre: nombre }
    });
  }, []);

  const executeToggleStatus = async () => {
    const { id_plan_estudio, vigente } = modalState.data;
    const endpoint = vigente ? `/planes-estudio/desactivar/${id_plan_estudio}` : `/planes-estudio/activar/${id_plan_estudio}`;

    try {
      await apiRequest(endpoint, { method: 'PUT' });
      await fetchData();
      setNotification({
        show: true,
        message: vigente ? "Plan dado de baja exitosamente" : "Plan reactivado exitosamente",
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

  const handleSavePlan = async (formData) => {
    if (!formData.nombre || !formData.id_carrera) {
      setNotificationModal({ show: true, message: "La carrera y el nombre son obligatorios", type: 'error' });
      return;
    }

    if (formData.fecha_inicio && formData.fecha_fin) {
      const yearInicio = parseInt(formData.fecha_inicio);
      const yearFin = parseInt(formData.fecha_fin);
      
      if (yearInicio >= yearFin) {
        setNotificationModal({ show: true, message: "El año de inicio debe ser anterior al año de fin", type: 'error' });
        return;
      }
    }

    try {
      const payload = {
        id_carrera: formData.id_carrera,
        nombre: formData.nombre,
        descripcion: formData.descripcion || null,
        fecha_inicio: formData.fecha_inicio ? new Date(`${formData.fecha_inicio}-01-01`) : null,
        fecha_fin: formData.fecha_fin ? new Date(`${formData.fecha_fin}-12-31`) : null,
        vigente: formData.vigente !== undefined ? formData.vigente : true
      };

      if (modalState.type === 'add') {
        await apiRequest('/planes-estudio', { method: 'POST', body: JSON.stringify(payload) });
        setNotificationModal({ show: true, message: "Plan de estudio creado exitosamente", type: 'success' });
      } else {
        await apiRequest(`/planes-estudio/actualizar/${formData.id_plan_estudio}`, { method: 'PUT', body: JSON.stringify(payload) });
        setNotificationModal({ show: true, message: "Plan de estudio actualizado exitosamente", type: 'success' });
      }
      await fetchData();
      setTimeout(() => closeModal(), 1500);
    } catch (error) {
      console.error("Error al guardar plan:", error);
      setNotificationModal({ show: true, message: error.message || "Error al procesar la solicitud", type: 'error' });
    }
  };

  const getYearFromDate = (dateString) => {
    if (!dateString) return '---';
    return new Date(dateString).getFullYear();
  };

  const columns = useMemo(() => [
    { header: 'Nombre del Plan', accessor: 'nombre' },
    { 
      header: 'Carrera', 
      accessor: 'carrera',
      render: (row) => row.carrera?.nombre || '---'
    },
    { header: 'Descripción', accessor: 'descripcion' },
    { 
      header: 'Año Inicio', 
      accessor: 'fecha_inicio',
      render: (row) => getYearFromDate(row.fecha_inicio)
    },
    { 
      header: 'Año Fin', 
      accessor: 'fecha_fin',
      render: (row) => getYearFromDate(row.fecha_fin)
    },
    { 
      header: 'Estado', 
      accessor: 'vigente',
      render: (row) => (
        <span 
          className={`status-badge ${row.vigente ? 'status-active' : 'status-inactive'} cursor-pointer`}
          onClick={() => toggleStatus(row.id_plan_estudio, row.vigente, row.nombre)}
          title={row.vigente ? "Clic para dar de baja" : "Clic para reactivar"}
        >
          {row.vigente ? 'Vigente' : 'Inactivo'}
        </span>
      )
    }
  ], [toggleStatus]);

  const filteredPlanes = useMemo(() => {
    return planes.filter(p => {
      // filtro por nombre o carrera)
      const lower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        p.nombre?.toLowerCase().includes(lower) || 
        p.carrera?.nombre?.toLowerCase().includes(lower);
      
      // filtro estados
      let matchesEstado = true;
      if (filterEstado === "activos") matchesEstado = p.vigente === true;
      if (filterEstado === "inactivos") matchesEstado = p.vigente === false;

      // filtro años
      let matchesYear = true;
      const startYear = getYearFromDate(p.fecha_inicio);
      
      if (startYear !== '---') {
        const from = filterYearFrom ? parseInt(filterYearFrom) : 0;
        const to = filterYearTo ? parseInt(filterYearTo) : 9999;
        matchesYear = startYear >= from && startYear <= to;
      }

      return matchesSearch && matchesEstado && matchesYear;
    });
  }, [planes, searchTerm, filterEstado, filterYearFrom, filterYearTo]);

  const openAddModal = () => {
    setNotificationModal({ show: false, message: '', type: 'error' });
    setModalState({ 
      isOpen: true, type: 'add', 
      data: { 
        id_carrera: '', nombre: '', descripcion: '',
        fecha_inicio: '', fecha_fin: '', vigente: true 
      } 
    });
  };

  const openEditModal = (item) => {
    setNotificationModal({ show: false, message: '', type: 'error' });
    setModalState({ 
      isOpen: true, type: 'edit', 
      data: { 
        ...item,
        fecha_inicio: item.fecha_inicio ? new Date(item.fecha_inicio).getFullYear() : '',
        fecha_fin: item.fecha_fin ? new Date(item.fecha_fin).getFullYear() : ''
      } 
    });
  };
  
  const closeModal = () => {
    setNotificationModal({ show: false, message: '', type: 'error' });
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return {
    planes: filteredPlanes, carreras, columns,
    searchTerm, setSearchTerm, 
    filterEstado, setFilterEstado,
    filterYearFrom, setFilterYearFrom,
    filterYearTo, setFilterYearTo,
    loading, modalState,
    openAddModal, openEditModal, closeModal,
    handleSavePlan, handleInputChange, executeToggleStatus,
    notification, setNotification,
    notificationModal, setNotificationModal
  };
};
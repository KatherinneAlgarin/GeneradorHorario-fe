import { useState, useMemo, useEffect, useCallback } from 'react';
import { apiRequest } from '../services/api';

export const useMaterias = () => {
  const [materias, setMaterias] = useState([]);
  const [tiposAula, setTiposAula] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [ciclos, setCiclos] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipoAula, setFilterTipoAula] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  
  const [modalState, setModalState] = useState({ 
    isOpen: false, 
    type: 'add', 
    data: {
      codigo: '', nombre: '', requiere_tipo_aula: '',
      horas_teoricas: '', horas_practicas: '',
      id_plan_estudio: '', ciclo_recomendado: ''
    }
  });

  const [notificationModal, setNotificationModal] = useState({
    show: false, message: '', type: 'error'
  });

  const [notification, setNotification] = useState({
    show: false, message: '', type: 'error'
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [m, t, p, c] = await Promise.all([
        apiRequest('/asignaturas'),
        apiRequest('/tipos-aula'),
        apiRequest('/planes-estudio'),
        apiRequest('/ciclos')
      ]);
      setMaterias(Array.isArray(m) ? m : []);
      setTiposAula(Array.isArray(t) ? t : []);
      setPlanes(Array.isArray(p) ? p : []);
      setCiclos(Array.isArray(c) ? c : []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setNotification({
        show: true, message: "Error de conexión al cargar catálogos.", type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

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
      data: { id_asignatura: id, activo: currentStatus, nombre: nombre }
    });
  }, []);

  const executeToggleStatus = async () => {
    const { id_asignatura, activo } = modalState.data;
    const endpoint = activo ? `/asignaturas/desactivar/${id_asignatura}` : `/asignaturas/activar/${id_asignatura}`;

    try {
      await apiRequest(endpoint, { method: 'PUT' });
      await fetchData();
      setNotification({
        show: true,
        message: activo ? "Asignatura dada de baja exitosamente" : "Asignatura reactivada exitosamente",
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

  const handleSaveMateria = async (formData) => {
    if (!formData.nombre || !formData.codigo || !formData.id_plan_estudio || !formData.ciclo_recomendado) {
      setNotificationModal({ show: true, message: 'Todos los campos son obligatorios.', type: 'error' });
      return;
    }
    try {
      const payload = {
        ...formData,
        horas_teoricas: parseInt(formData.horas_teoricas) || 0,
        horas_practicas: parseInt(formData.horas_practicas) || 0,
        ciclo_recomendado: parseInt(formData.ciclo_recomendado)
      };
      
      const url = modalState.type === 'add' ? '/asignaturas' : `/asignaturas/actualizar/${formData.id_asignatura}`;
      const method = modalState.type === 'add' ? 'POST' : 'PUT';
      
      await apiRequest(url, { method, body: JSON.stringify(payload) });
      setNotificationModal({
        show: true,
        message: modalState.type === 'add' ? 'Asignatura creada correctamente' : 'Asignatura actualizada correctamente',
        type: 'success'
      });
      await fetchData();
      setTimeout(() => closeModal(), 1500);
      } catch (error) {
      setNotificationModal({ show: true, message: error.message || "Error al procesar la solicitud", type: 'error' });
    }
  };

  const columns = useMemo(() => [
    { header: 'Código', accessor: 'codigo' },
    { header: 'Asignatura', accessor: 'nombre' },
    { 
      header: 'Req. Aula', 
      accessor: 'requiere_tipo_aula',
      render: (row) => row.tipo_aula?.nombre || '---'
    },
    { header: 'H. Teóricas', accessor: 'horas_teoricas' },
    { header: 'H. Prácticas', accessor: 'horas_practicas' },
    { 
      header: 'Estado', 
      accessor: 'activo',
      render: (row) => (
        <span 
          className={`status-badge ${row.activo ? 'status-active' : 'status-inactive'} cursor-pointer`}
          onClick={() => toggleStatus(row.id_asignatura, row.activo, row.nombre)}
          title={row.activo ? "Clic para dar de baja" : "Clic para reactivar"}
        >
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    }
  ], [toggleStatus]);

  const filteredMaterias = useMemo(() => {
    return materias.filter(m => {
      // filtro de texto
      const lower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        m.nombre?.toLowerCase().includes(lower) || 
        m.codigo?.toLowerCase().includes(lower);

      // filtro tipo de aula
      const matchesTipoAula = !filterTipoAula || m.requiere_tipo_aula === filterTipoAula;

      // filtro estado
      let matchesEstado = true;
      if (filterEstado === "activos") matchesEstado = m.activo === true;
      if (filterEstado === "inactivos") matchesEstado = m.activo === false;

      return matchesSearch && matchesTipoAula && matchesEstado;
    });
  }, [materias, searchTerm, filterTipoAula, filterEstado]);

  const openAddModal = () => {
    setNotificationModal({ show: false, message: '', type: 'error' });
    setModalState({ 
      isOpen: true, 
      type: 'add', 
      data: { 
        codigo: '', nombre: '', requiere_tipo_aula: '', 
        horas_teoricas: '', horas_practicas: '',
        id_plan_estudio: '', ciclo_recomendado: '' 
      } 
    });
  };

  const openEditModal = (item) => {
    setNotificationModal({ show: false, message: '', type: 'error' });
    const planRelacion = item.plan_asignatura?.[0] || {};
    setModalState({ 
      isOpen: true, 
      type: 'edit', 
      data: { 
        ...item, 
        horas_teoricas: item.horas_teoricas === 0 ? '' : item.horas_teoricas,
        horas_practicas: item.horas_practicas === 0 ? '' : item.horas_practicas,
        id_plan_estudio: planRelacion.id_plan_estudio || '',
        ciclo_recomendado: planRelacion.ciclo_recomendado || ''
      } 
    });
  };

  const closeModal = () => {
    setNotificationModal({ show: false, message: '', type: 'error' });
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return {
    materias: filteredMaterias, tiposAula, planes, ciclos, columns,
    searchTerm, setSearchTerm, 
    filterTipoAula, setFilterTipoAula,
    filterEstado, setFilterEstado,
    modalState, loading,
    openAddModal, openEditModal, closeModal, 
    handleSaveMateria, handleInputChange, executeToggleStatus,
    notificationModal, setNotificationModal,
    notification, setNotification
  };
};
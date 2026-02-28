import { useState, useMemo, useCallback, useEffect } from 'react';
// import { apiRequest } from '../services/api'; // FUTURO BACKEND

const initialDecanos = [
  { 
    id_administrador: "admin-deca-1", 
    nombres: "Katherinne", 
    apellidos: "Cruz", 
    correo: "katherinne.cruz1@catolica.edu.sv", 
    id_facultad: "fac-1",
    facultad: { nombre: "Ingeniería y Arquitectura" },
    activo: true 
  },
  { 
    id_administrador: "admin-deca-2", 
    nombres: "Roberto", 
    apellidos: "Gómez", 
    correo: "roberto.gomez@catolica.edu.sv", 
    id_facultad: "fac-2",
    facultad: { nombre: "Ciencias y Humanidades" },
    activo: false 
  }
];

const mockFacultades = [
  { id_facultad: "fac-1", nombre: "Ingeniería y Arquitectura", activo: true },
  { id_facultad: "fac-2", nombre: "Ciencias y Humanidades", activo: true },
  { id_facultad: "fac-3", nombre: "Ciencias de la Salud", activo: true },
];

export const useDecanos = () => {
  const [decanos, setDecanos] = useState([]); 
  const [facultades, setFacultades] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterFacultad, setFilterFacultad] = useState("");

  const [modalState, setModalState] = useState({
    isOpen: false, type: 'view', data: null
  });

  const [notificationModal, setNotificationModal] = useState({
    show: false, message: '', type: 'error'
  });

  const [notification, setNotification] = useState({
    show: false, message: '', type: 'error'
  });

  const fetchDatos = useCallback(async () => {
    setLoading(true);
    try {
      //await Promise.all([apiRequest('/decanos'), apiRequest('/facultades')])
      await new Promise(resolve => setTimeout(resolve, 500)); 
      setDecanos(initialDecanos);
      setFacultades(mockFacultades);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setNotification({ show: true, message: "Error al cargar decanos.", type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDatos(); }, [fetchDatos]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalState(prev => ({
      ...prev,
      data: { ...prev.data, [name]: value }
    }));
  };

  const filteredDecanos = useMemo(() => {
    return decanos.filter(decano => {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        decano.nombres.toLowerCase().includes(lowerSearch) ||
        decano.apellidos.toLowerCase().includes(lowerSearch) ||
        decano.correo.toLowerCase().includes(lowerSearch);
      
      let matchesEstado = true;
      if (filterEstado === "activos") matchesEstado = decano.activo === true;
      if (filterEstado === "inactivos") matchesEstado = decano.activo === false;

      const matchesFacultad = !filterFacultad || decano.id_facultad === filterFacultad;

      return matchesSearch && matchesEstado && matchesFacultad;
    });
  }, [decanos, searchTerm, filterEstado, filterFacultad]);

  const toggleStatus = useCallback((id, currentStatus, nombre) => {
    setNotificationModal({ show: false, message: '', type: 'error' });
    setModalState({
      isOpen: true,
      type: 'confirmToggle',
      data: { id_administrador: id, activo: currentStatus, nombre: nombre }
    });
  }, []);

  const executeToggleStatus = async () => {
    const { id_administrador, activo } = modalState.data;
    try {
      //await apiRequest(`/decanos/${activo ? 'desactivar' : 'activar'}/${id_administrador}`, { method: 'PUT' });
      setDecanos(prev => prev.map(d => d.id_administrador === id_administrador ? { ...d, activo: !activo } : d));
      
      setNotification({
        show: true,
        message: activo ? 'Decano dado de baja' : 'Decano reactivado',
        type: 'success'
      });
      closeModal();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      setNotificationModal({ show: true, message: "Error al cambiar estado", type: 'error' });
    }
  };

  const columns = useMemo(() => [
    { header: 'Decano', render: (row) => `${row.nombres} ${row.apellidos}` },
    { header: 'Correo', accessor: 'correo' },
    { header: 'Facultad Dirigida', render: (row) => row.facultad?.nombre || '---' },
    { 
      header: 'Estado', accessor: 'activo',
      render: (row) => (
        <span 
          className={`status-badge ${row.activo ? 'status-active' : 'status-inactive'} cursor-pointer`}
          onClick={() => toggleStatus(row.id_administrador, row.activo, `${row.nombres} ${row.apellidos}`)}
        >
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    }
  ], [toggleStatus]);

  const openAddModal = () => {
    setNotificationModal({ show: false, message: '', type: 'error' });
    setModalState({ 
      isOpen: true, type: 'add',
      data: { nombres: '', apellidos: '', email: '', id_facultad: '', activo: true } 
    });
  };

  const openEditModal = (decano) => {
    setNotificationModal({ show: false, message: '', type: 'error' });
    setModalState({ 
      isOpen: true, type: 'edit', 
      data: { ...decano, email: decano.correo } 
    });
  };

  const closeModal = () => {
    setNotificationModal({ show: false, message: '', type: 'error' });
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleSaveDecano = async (formData) => {
    if (!formData.nombres || !formData.apellidos || !formData.id_facultad) {
      setNotificationModal({ show: true, message: "Nombre, apellidos y facultad son obligatorios.", type: 'error' });
      return;
    }
    if (modalState.type === 'add' && !formData.email) {
      setNotificationModal({ show: true, message: "El correo es obligatorio para crear el usuario.", type: 'error' });
      return;
    }

    try {
      const payload = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        id_facultad: formData.id_facultad
      };

      if (modalState.type === 'add') {
        payload.email = formData.email;
        //await apiRequest('/decanos', { method: 'POST', body: JSON.stringify(payload) });
        
        const facEncontrada = facultades.find(f => f.id_facultad === formData.id_facultad);
        const newDecano = { 
          ...payload, 
          correo: formData.email, 
          id_administrador: crypto.randomUUID(), 
          facultad: { nombre: facEncontrada?.nombre },
          activo: true 
        };
        setDecanos(prev => [...prev, newDecano]);

      } else {
        // await apiRequest(`/decanos/actualizar/${formData.id_administrador}`, { method: 'PUT', body: JSON.stringify(payload) });
        
        const facEncontrada = facultades.find(f => f.id_facultad === formData.id_facultad);
        setDecanos(prev => prev.map(d => d.id_administrador === formData.id_administrador ? { 
          ...d, ...payload, facultad: { nombre: facEncontrada?.nombre }
        } : d));
      }

      setNotificationModal({
        show: true, message: modalState.type === 'add' ? 'Decano registrado exitosamente' : 'Decano actualizado exitosamente', type: 'success'
      });
      setTimeout(() => closeModal(), 1500);
    } catch (error) {
      console.error("Error al guardar:", error);
      setNotificationModal({ show: true, message: "Error al procesar la solicitud", type: 'error' });
    }
  };

  return {
    decanos: filteredDecanos, facultades, columns,
    searchTerm, setSearchTerm, filterEstado, setFilterEstado, filterFacultad, setFilterFacultad,
    modalState, loading, openAddModal, openEditModal, closeModal,
    handleSaveDecano, handleInputChange, executeToggleStatus,
    notificationModal, setNotificationModal, notification, setNotification
  };
};
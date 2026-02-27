import { useState, useMemo, useCallback, useEffect } from 'react';
// import { apiRequest } from '../services/api'; // cuando ya haya backend esta comentado para futuros cambios

const initialDocentes = [
  { id_docente: "d-001", nombres: "Juan Carlos", apellidos: "Pérez", tipo: "Tiempo Completo", carga_maxima: 40, activo: true },
  { id_docente: "d-002", nombres: "Maria", apellidos: "Rodriguez", tipo: "Hora Clase", carga_maxima: 20, activo: true },
  { id_docente: "d-003", nombres: "Carlos", apellidos: "Gómez", tipo: "Hora Clase", carga_maxima: 12, activo: false },
];

const mockClasesHistory = [
  { id_clase: 'c1', id_docente: 'd-001', materia: 'Matemáticas I', ciclo: '01-2025', codigo: 'MAT101' },
  { id_clase: 'c2', id_docente: 'd-001', materia: 'Cálculo II', ciclo: '02-2024', codigo: 'MAT102' },
  { id_clase: 'c3', id_docente: 'd-002', materia: 'Física I', ciclo: '01-2025', codigo: 'FIS101' },
];

export const useDocentes = () => {
  const [docentes, setDocentes] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState(""); 
  const [filterEstado, setFilterEstado] = useState("");

  const [teachingHistory, setTeachingHistory] = useState([]);
  
  const [modalState, setModalState] = useState({
    isOpen: false, type: 'view', data: null
  });

  const [notificationModal, setNotificationModal] = useState({
    show: false, message: '', type: 'error'
  });

  const [notification, setNotification] = useState({
    show: false, message: '', type: 'error'
  });

  const fetchDocentes = useCallback(async () => {
    setLoading(true);
    try {
      //const data = await apiRequest('/docentes');
      await new Promise(resolve => setTimeout(resolve, 500)); 
      setDocentes(initialDocentes);
    } catch (error) {
      console.error("Error al cargar docentes:", error);
      setNotification({ show: true, message: "Error al cargar docentes.", type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocentes();
  }, [fetchDocentes]);

  // funcion que escucha cambios en el teclado
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalState(prev => ({
      ...prev,
      data: { ...prev.data, [name]: value }
    }));
  };

  const filteredDocentes = useMemo(() => {
    return docentes.filter(docente => {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        docente.nombres.toLowerCase().includes(lowerSearch) ||
        docente.apellidos.toLowerCase().includes(lowerSearch);

      const matchesTipo = !filterTipo || docente.tipo === filterTipo;
      
      let matchesEstado = true;
      if (filterEstado === "activos") matchesEstado = docente.activo === true;
      if (filterEstado === "inactivos") matchesEstado = docente.activo === false;

      return matchesSearch && matchesTipo && matchesEstado;
    });
  }, [docentes, searchTerm, filterTipo, filterEstado]);

  const toggleStatus = useCallback(async (id, currentStatus) => {
    const accionTexto = currentStatus ? "dar de baja" : "reactivar";
    
    if (window.confirm(`¿Confirma ${accionTexto} este docente?`)) {
      try {
        // const endpoint = currentStatus ? `/docentes/desactivar/${id}` : `/docentes/activar/${id}`;
        setDocentes(prev => prev.map(d => d.id_docente === id ? { ...d, activo: !currentStatus } : d));
        
        setNotification({
          show: true,
          message: currentStatus ? 'Docente dado de baja' : 'Docente reactivado',
          type: 'success'
        });
      } catch (error) {
        console.error("Error al cambiar estado:", error);
        setNotification({ show: true, message: "Error al cambiar estado", type: 'error' });
      }
    }
  }, []);

  const columns = useMemo(() => [
    { header: 'Nombres', accessor: 'nombres' },
    { header: 'Apellidos', accessor: 'apellidos' },
    { header: 'Tipo', accessor: 'tipo' },
    { header: 'Carga Máx', accessor: 'carga_maxima' },
    { 
      header: 'Estado', accessor: 'activo',
      render: (row) => (
        <span 
          className={`status-badge ${row.activo ? 'status-active' : 'status-inactive'} cursor-pointer`}
          onClick={() => toggleStatus(row.id_docente, row.activo)}
          title={row.activo ? 'Clic para dar de baja' : 'Clic para reactivar'}
        >
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    }
  ], [toggleStatus]);

  const openDetailsModal = (docente) => {
    const history = mockClasesHistory.filter(h => h.id_docente === docente.id_docente);
    setTeachingHistory(history);
    setNotificationModal({ show: false, message: '', type: 'error' });
    setModalState({ isOpen: true, type: 'details', data: docente });
  };

  const openAddModal = () => {
    setNotificationModal({ show: false, message: '', type: 'error' });
    setModalState({ 
      isOpen: true, type: 'add',
      data: { nombres: '', apellidos: '', tipo: 'Tiempo Completo', carga_maxima: '', activo: true } 
    });
  };

  const openEditModal = (docente) => {
    setNotificationModal({ show: false, message: '', type: 'error' });
    setModalState({ 
      isOpen: true, type: 'edit', 
      data: { 
        ...docente,
        carga_maxima: docente.carga_maxima === 0 ? '' : docente.carga_maxima
      } 
    });
  };

  const closeModal = () => {
    setNotificationModal({ show: false, message: '', type: 'error' });
    setModalState(prev => ({ ...prev, isOpen: false }));
    setTeachingHistory([]); 
  };

  const handleSaveDocente = async (formData) => {
    if (!formData.nombres || !formData.apellidos || !formData.carga_maxima) {
      setNotificationModal({ show: true, message: "Todos los campos son obligatorios.", type: 'error' });
      return;
    }

    const dataToSave = {
      ...formData,
      carga_maxima: parseInt(formData.carga_maxima) || 0
    };

    try {
      if (modalState.type === 'add') {
        const newDocente = { ...dataToSave, id_docente: crypto.randomUUID(), activo: true };
        setDocentes(prev => [...prev, newDocente]);
      } else {
        setDocentes(prev => prev.map(d => d.id_docente === dataToSave.id_docente ? dataToSave : d));
      }

      setNotificationModal({
        show: true,
        message: modalState.type === 'add' ? 'Docente registrado' : 'Docente actualizado',
        type: 'success'
      });
      setTimeout(() => closeModal(), 1500);
    } catch (error) {
      console.error("Error al guardar docente:", error);
      setNotificationModal({ show: true, message: "Error al procesar la solicitud", type: 'error' });
    }
  };

  return {
    docentes: filteredDocentes, columns,
    searchTerm, setSearchTerm,
    filterTipo, setFilterTipo,       
    filterEstado, setFilterEstado,   
    modalState, teachingHistory, loading,
    openAddModal, openEditModal, openDetailsModal, closeModal,
    handleSaveDocente, handleInputChange, toggleStatus,
    notificationModal, setNotificationModal,
    notification, setNotification
  };
};
import { useState, useMemo, useEffect, useCallback } from 'react';
import { apiRequest } from '../services/api';

const MOCK_EQUIPOS = [
  { id_equipamiento: 1, nombre: 'Proyector Multimedia' },
  { id_equipamiento: 2, nombre: 'Aire Acondicionado' },
  { id_equipamiento: 3, nombre: 'Pizarra Inteligente' },
  { id_equipamiento: 4, nombre: 'Computadora Instructor' },
  { id_equipamiento: 5, nombre: 'Escritorio Docente' }
];

export const useAulas = () => {
  const [aulas, setAulas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [equipos, setEquipos] = useState(MOCK_EQUIPOS);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'add',
    data: { nombre: '', edificio: '', ubicacion: 'Campus', capacidad: 30, id_tipo_aula: '', equipamiento_ids: [], activo: true }
  });

  const [equipModal, setEquipModal] = useState({
    isOpen: false,
    aulaNombre: '',
    listaEquipos: []
  });

  const fetchAulas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/aulas');
      setAulas(data);
    } catch (error) {
      console.error("Error al cargar aulas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTipos = useCallback(async () => {
    try {
      const data = await apiRequest('/tipos-aula');
      setTipos(data);
    } catch (error) {
      console.error("Error al cargar tipos de aula:", error);
    }
  }, []);

  const fetchEquipos = useCallback(async () => {
    try {
      const data = await apiRequest('/equipamiento');
      setEquipos(data);
    } catch (error) {
      console.error("Error al cargar equipamiento:", error);
    }
  }, []);

  useEffect(() => {
    fetchAulas();
    fetchTipos();
    fetchEquipos();
  }, [fetchAulas, fetchTipos, fetchEquipos]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setModalState(prev => ({
      ...prev,
      data: { ...prev.data, [name]: val }
    }));
  };

  const openEquipamientoModal = (row) => {
    const nombres = row.equipamiento_ids?.map(id => {
        const eq = equipos.find(e => e.id_equipamiento === parseInt(id));
        return eq ? eq.nombre : null;
    }).filter(Boolean) || [];

    setEquipModal({
        isOpen: true,
        aulaNombre: row.nombre,
        listaEquipos: nombres
    });
  };

  const closeEquipModal = () => setEquipModal({ isOpen: false, aulaNombre: '', listaEquipos: [] });

  const toggleStatus = async (id) => {
    const aula = aulas.find(a => a.id_aula === id);
    if (!aula) return;
    
    const newStatus = !aula.activo;
    try {
      await apiRequest(`/aulas/actualizar/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...aula, activo: newStatus })
      });
      await fetchAulas();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const columns = useMemo(() => [
    { header: 'Aula', accessor: 'nombre' },
    { header: 'Edificio', accessor: 'edificio' },
    { header: 'Ubicación', accessor: 'ubicacion' },
    { header: 'Capacidad', accessor: 'capacidad' },
    { 
      header: 'Tipo', 
      accessor: 'id_tipo_aula',
      render: (row) => {
        const tipoId = row.id_tipo_aula;
        const tipo = tipos.find(t => t.id_tipo_aula == tipoId || t.id_tipo_aula === tipoId);
        return tipo ? tipo.nombre : `(${tipoId})`;
      }
    },
    { 
      header: 'Equipamiento', 
      accessor: 'equipamiento_ids',
      render: (row) => (
        <button 
          className="btn-view-details"
          onClick={() => openEquipamientoModal(row)}
        >
          Ver Detalle
        </button>
      )
    },
    { 
      header: 'Estado', 
      accessor: 'activo',
      render: (row) => (
        <span 
          className={`status-badge ${row.activo ? 'status-active' : 'status-inactive'} cursor-pointer`}
          onClick={() => toggleStatus(row.id_aula)}
        >
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    }
  ], [tipos, equipos]);

  const filteredAulas = useMemo(() => {
    if (!searchTerm) return aulas;
    const lower = searchTerm.toLowerCase();
    
    return aulas.filter(a => {
      const nombreTipo = tipos.find(t => t.id_tipo_aula == a.id_tipo_aula || t.id_tipo_aula === a.id_tipo_aula)?.nombre?.toLowerCase() || '';
      return (
        a.nombre?.toLowerCase().includes(lower) || 
        a.edificio?.toLowerCase().includes(lower) ||
        a.ubicacion?.toLowerCase().includes(lower) ||
        nombreTipo.includes(lower)
      );
    });
  }, [aulas, tipos, searchTerm]);

  const handleSaveAula = async (formData) => {
    if (!formData.nombre || !formData.edificio || !formData.id_tipo_aula || !formData.capacidad || !formData.ubicacion) {
      return alert("Complete los campos obligatorios.");
    }

    const dataToSave = {
      ...formData,
      id_tipo_aula: parseInt(formData.id_tipo_aula),
      capacidad: parseInt(formData.capacidad),
      equipamiento_ids: formData.equipamiento_ids ? formData.equipamiento_ids.map(id => parseInt(id)) : []
    };

    try {
      if (modalState.type === 'add') {
        await apiRequest('/aulas', {
          method: 'POST',
          body: JSON.stringify(dataToSave)
        });
      } else {
        await apiRequest(`/aulas/actualizar/${formData.id_aula}`, {
          method: 'PUT',
          body: JSON.stringify(dataToSave)
        });
      }
      await fetchAulas();
      closeModal();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al procesar la solicitud");
    }
  };

  const deleteAula = async (id) => {
    if (window.confirm("¿Confirma eliminar esta aula?")) {
      try {
        await apiRequest(`/aulas/${id}`, { method: 'DELETE' });
        await fetchAulas();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const openAddModal = () => {
    setModalState({ 
      isOpen: true, type: 'add', 
      data: { nombre: '', edificio: '', ubicacion: 'Campus', capacidad: 30, id_tipo_aula: '', equipamiento_ids: [], activo: true } 
    });
  };

  const openEditModal = (item) => setModalState({ isOpen: true, type: 'edit', data: { ...item } });
  const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  return {
    aulas: filteredAulas, 
    tipos,
    equipos,
    columns,
    searchTerm, setSearchTerm,
    modalState,
    equipModal,
    openAddModal, openEditModal, closeModal,
    closeEquipModal,
    handleSaveAula,
    handleInputChange,
    deleteAula,
    loading
  };
};

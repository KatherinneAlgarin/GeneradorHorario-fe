import { useState, useMemo } from 'react';

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
  const [docentes, setDocentes] = useState(initialDocentes);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [teachingHistory, setTeachingHistory] = useState([]);

  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'view',
    data: null
  });

  const filteredDocentes = useMemo(() => {
    if (!searchTerm) return docentes;
    const lowerSearch = searchTerm.toLowerCase();
    return docentes.filter(docente => 
      docente.nombres.toLowerCase().includes(lowerSearch) ||
      docente.apellidos.toLowerCase().includes(lowerSearch)
    );
  }, [docentes, searchTerm]);

  const validateDocente = (formData) => {
    if (!formData.nombres) return "El nombre es obligatorio.";
    if (!formData.apellidos) return "El apellido es obligatorio.";
    return null;
  };

  const openDetailsModal = (docente) => {
    const history = mockClasesHistory.filter(h => h.id_docente === docente.id_docente);
    setTeachingHistory(history);

    setModalState({ isOpen: true, type: 'details', data: docente });
  };

  const openAddModal = () => {
    setModalState({ 
      isOpen: true, type: 'add', 
      data: { nombres: '', apellidos: '', tipo: 'Tiempo Completo', carga_maxima: 40, activo: true } 
    });
  };

  const openEditModal = (docente) => {
    setModalState({ isOpen: true, type: 'edit', data: { ...docente } });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
    setTeachingHistory([]); 
  };

const handleSaveDocente = (formData) => {
    const error = validateDocente(formData);
    if (error) return alert(error);

    if (modalState.type === 'add') {
      const newDocente = { ...formData, id_docente: crypto.randomUUID(), activo: true };
      setDocentes([...docentes, newDocente]);
    } else {
      setDocentes(docentes.map(d => d.id_docente === formData.id_docente ? formData : d));
    }
    closeModal();
  };

  const deleteDocente = (id) => {
    if(window.confirm("¿Eliminar docente?")) setDocentes(docentes.filter(d => d.id_docente !== id));
  };

  const toggleStatus = (id) => {
    setDocentes(docentes.map(d => d.id_docente === id ? { ...d, activo: !d.activo } : d));
  };

  // Función para procesar csv
  const handleImportDocentes = (csvData) => {
    let importedCount = 0;
    const newDocentes = [];

    csvData.forEach(row => {
      if (row.nombres && row.apellidos) {
        newDocentes.push({
          id_docente: crypto.randomUUID(),
          nombres: row.nombres,
          apellidos: row.apellidos,
          tipo: row.tipo || 'Tiempo Completo',
          carga_maxima: parseInt(row.carga_maxima) || 40,
          activo: true
        });
        importedCount++;
      }
    });

    if (importedCount > 0) {
      setDocentes(prev => [...prev, ...newDocentes]);
      alert(`✅ Se importaron ${importedCount} docentes correctamente.`);
    } else {
      alert("⚠️ No se encontraron docentes válidos en el archivo. Verifica las columnas (nombres, apellidos).");
    }
  };

  return {
    docentes: filteredDocentes,
    searchTerm, setSearchTerm,
    modalState, teachingHistory,
    openAddModal, openEditModal, openDetailsModal, closeModal,
    handleSaveDocente, deleteDocente, toggleStatus,
    handleImportDocentes
  };
};
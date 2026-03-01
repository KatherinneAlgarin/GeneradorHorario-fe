import { useState, useEffect, useCallback, useMemo } from 'react';
// import { apiRequest } from '../services/api'; 
// import { supabase } from '../services/supabaseClient';


const MOCK_DOCENTE = {
  id_docente: "doc-123",
  nombres: "Katherinne",
  apellidos: "Cruz",
  carga_minima: 8, 
  facultades: ["fac-ing"]
};

const MOCK_CICLO_ACTIVO = {
  id_ciclo_academico: "ciclo-01-2026",
  nombre: "Ciclo 01-2026",
  estado_horario: "PLANIFICACION"
};

const MOCK_BLOQUES = [
  { id_bloque_horario: "b1", dia_semana: 1, hora_inicio: "08:00:00", hora_fin: "09:40:00" },
  { id_bloque_horario: "b2", dia_semana: 1, hora_inicio: "09:50:00", hora_fin: "11:30:00" }, 
  { id_bloque_horario: "b3", dia_semana: 2, hora_inicio: "08:00:00", hora_fin: "09:40:00" },
  { id_bloque_horario: "b4", dia_semana: 3, hora_inicio: "13:00:00", hora_fin: "14:40:00" },
  { id_bloque_horario: "b5", dia_semana: 4, hora_inicio: "15:00:00", hora_fin: "16:40:00" },
  { id_bloque_horario: "b6", dia_semana: 5, hora_inicio: "08:00:00", hora_fin: "09:40:00" },
];

const MOCK_ASIGNATURAS = [
  { id_asignatura: "asig-1", nombre: "Programación Orientada a Objetos", id_facultad: "fac-ing" },
  { id_asignatura: "asig-2", nombre: "Bases de Datos I", id_facultad: "fac-ing" },
  { id_asignatura: "asig-3", nombre: "Derecho Romano", id_facultad: "fac-der" },
];


export const useRegistroDisponibilidad = () => {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Datos base
  const [docente, setDocente] = useState(null);
  const [ciclo, setCiclo] = useState(null);
  const [bloques, setBloques] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);

  // Selecciones del usuario
  const [bloquesSeleccionados, setBloquesSeleccionados] = useState([]);
  const [asignaturasSeleccionadas, setAsignaturasSeleccionadas] = useState([]);

  const [notification, setNotification] = useState({ show: false, message: '', type: 'error' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      /* algunos posibles cambios cuando ya se ten ga bien el backend
      const { data: { user } } = await supabase.auth.getUser();
      const docenteInfo = await apiRequest(`/docentes/auth/${user.id}`); 
      const cicloActivo = await apiRequest('/ciclos/activo');
      const catalogoBloques = await apiRequest('/preferencias/bloques');
      const catalogoAsignaturas = await apiRequest(`/asignaturas/facultad/${docenteInfo.id_facultad}`);
      const miDisponibilidad = await apiRequest(`/preferencias/disponibilidad/${docenteInfo.id_docente}`);
      const misAsignaturas = await apiRequest(`/preferencias/asignaturas/${docenteInfo.id_docente}?id_ciclo=${cicloActivo.id_ciclo_academico}`);

      setDocente(docenteInfo);
      setCiclo(cicloActivo);
      setBloques(catalogoBloques);
      setAsignaturas(catalogoAsignaturas);
      setBloquesSeleccionados(miDisponibilidad.map(d => d.id_bloque_horario));
      setAsignaturasSeleccionadas(misAsignaturas.map(a => a.id_asignatura));
      */

      // simulacion
      await new Promise(resolve => setTimeout(resolve, 800)); // Simula delay de red
      
      setDocente(MOCK_DOCENTE);
      setCiclo(MOCK_CICLO_ACTIVO);
      setBloques(MOCK_BLOQUES);
      
      const asignaturasFiltradas = MOCK_ASIGNATURAS.filter(asig => 
        MOCK_DOCENTE.facultades.includes(asig.id_facultad)
      );
      setAsignaturas(asignaturasFiltradas);
      
      setBloquesSeleccionados(["b1", "b2"]);
      setAsignaturasSeleccionadas(["asig-1"]); 

    } catch (error) {
      console.error("Error al cargar disponibilidad:", error);
      setNotification({ show: true, message: "Error al cargar los datos.", type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // manejo de clicks
  const toggleBloque = (id_bloque) => {
    if (ciclo?.estado_horario === "EN REVISION" || ciclo?.estado_horario === "OFICIAL") return;

    setBloquesSeleccionados(prev => 
      prev.includes(id_bloque) ? prev.filter(id => id !== id_bloque) : [...prev, id_bloque]
    );
  };

  const toggleAsignatura = (id_asignatura) => {
    if (ciclo?.estado_horario === "EN REVISION" || ciclo?.estado_horario === "OFICIAL") return;

    setAsignaturasSeleccionadas(prev => 
      prev.includes(id_asignatura) ? prev.filter(id => id !== id_asignatura) : [...prev, id_asignatura]
    );
  };

  // calculo de horas que luego se cambiara porque el backend ya lo hace
  const calcularHoras = (horaInicio, horaFin) => {
    const [hI, mI] = horaInicio.split(':').map(Number);
    const [hF, mF] = horaFin.split(':').map(Number);
    return (hF + mF / 60) - (hI + mI / 60);
  };

  const horasOfrecidas = useMemo(() => {
    if (!bloques.length) return 0;
    
    let total = 0;
    bloquesSeleccionados.forEach(idBloque => {
      const bloqueObj = bloques.find(b => b.id_bloque_horario === idBloque);
      if (bloqueObj) {
        total += calcularHoras(bloqueObj.hora_inicio, bloqueObj.hora_fin);
      }
    });
    return parseFloat(total.toFixed(1));
  }, [bloquesSeleccionados, bloques]);


  const handleGuardar = async () => {
    if (docente.carga_minima > 0 && horasOfrecidas < docente.carga_minima) {
      setNotification({ 
        show: true, 
        message: `Faltan horas. Tu contrato es de ${docente.carga_minima} hrs, pero solo has seleccionado ${horasOfrecidas} hrs.`, 
        type: 'error' 
      });
      return;
    }

    if (asignaturasSeleccionadas.length === 0) {
      setNotification({ show: true, message: "Debes seleccionar al menos una materia de preferencia.", type: 'error' });
      return;
    }

    setIsSaving(true);
    setNotification({ show: false, message: '', type: 'error' });

    try {
      /* para cuando ya se tenga el backend
      await apiRequest(`/preferencias/disponibilidad/${docente.id_docente}`, {
        method: 'POST',
        body: JSON.stringify({ bloques: bloquesSeleccionados })
      });

      await apiRequest(`/preferencias/asignaturas/${docente.id_docente}`, {
        method: 'POST',
        body: JSON.stringify({ 
          id_ciclo_academico: ciclo.id_ciclo_academico, 
          asignaturas: asignaturasSeleccionadas 
        })
      });
      */

      // simulacion
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Guardando en BD...", { bloquesSeleccionados, asignaturasSeleccionadas });

      setNotification({ show: true, message: "¡Tus preferencias han sido guardadas exitosamente!", type: 'success' });
      
    } catch (error) {
      console.error("Error al guardar:", error);
      setNotification({ show: true, message: error.message || "Error al guardar los datos.", type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const isEditable = ciclo?.estado_horario === "PLANIFICACION";

  return {
    loading, isSaving, notification, setNotification,
    docente, ciclo, isEditable,
    bloques, bloquesSeleccionados, toggleBloque,
    asignaturas, asignaturasSeleccionadas, toggleAsignatura,
    horasOfrecidas, handleGuardar
  };
};
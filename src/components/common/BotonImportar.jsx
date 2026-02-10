import React, { useRef } from 'react';
import '../../styles/AdminDashboard.css';

const BotonImportar = ({ onDataLoaded, label = "Importar CSV" }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
      const data = processCSV(text);
      if (data && data.length > 0) {
        onDataLoaded(data); 
      } else {
        alert("El archivo parece estar vacío o tener un formato incorrecto.");
      }
      e.target.value = '';
    };

    reader.readAsText(file);
  };

  // Función auxiliar para convertir texto CSV a Array de Objetos
  const processCSV = (str, delimiter = ',') => {
    const headers = str.slice(0, str.indexOf('\n')).split(delimiter).map(h => h.trim());
    const rows = str.slice(str.indexOf('\n') + 1).split('\n');

    const newArray = rows.map(row => {
      const values = row.split(delimiter);
      if (values.length !== headers.length) return null;

      const el = headers.reduce((object, header, index) => {
        object[header] = values[index]?.trim(); 
        return object;
      }, {});
      return el;
    }).filter(item => item !== null);

    return newArray;
  };

  return (
    <>
      <input 
        type="file" 
        accept=".csv" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileUpload} 
      />
      <button 
        className="btn-secondary"
        onClick={() => fileInputRef.current.click()}
        title="Subir archivo .csv"
      >
        {label}
      </button>
    </>
  );
};

export default BotonImportar;
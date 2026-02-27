import React from 'react';
import '../../styles/AdminDashboard.css';

const FiltroYear = ({ fromYear, toYear, onFromChange, onToChange }) => {
  const handleKeyDown = (e) => {
    if (['e', 'E', '+', '-', '.', ','].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="filter-container" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <span style={{ fontSize: '0.9rem', color: '#555', fontWeight: '500' }}>Año:</span>
      <input 
        type="number" 
        className="form-input"
        style={{ width: '80px', padding: '6px', margin: 0, fontSize: '0.9rem' }}
        placeholder="Desde" 
        value={fromYear}
        onChange={(e) => onFromChange(e.target.value.slice(0, 4))} 
        onKeyDown={handleKeyDown}
        min="1990"
      />
      <span style={{ color: '#aaa' }}>-</span>
      <input 
        type="number" 
        className="form-input"
        style={{ width: '80px', padding: '6px', margin: 0, fontSize: '0.9rem' }}
        placeholder="Hasta" 
        value={toYear}
        onChange={(e) => onToChange(e.target.value.slice(0, 4))}
        onKeyDown={handleKeyDown}
        max="2100"
      />
    </div>
  );
};

export default FiltroYear;
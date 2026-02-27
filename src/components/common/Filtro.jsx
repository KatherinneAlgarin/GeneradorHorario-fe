import React from 'react';
import '../../styles/AdminDashboard.css';

const Filtro = ({ value, onChange, options, defaultLabel = "Todos" }) => {
  return (
    <div className="filter-container">
      <select
        className="form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ minWidth: '180px', margin: 0 }}
      >
        <option value="">{defaultLabel}</option>
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filtro;
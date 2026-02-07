import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/login/Login';
import HomeDecano from '../pages/decano/HomeDecano';
import HomeDocente from '../pages/docente/HomeDocente';
import HomeAdmin from '../pages/admin/HomeAdmin';
import MainLayout from '../components/layout/MainLayout';


export const AppRouter = () => {
    return (
        <Routes>
            {/* Login */}
            <Route path="/" element={<Navigate to="/login" />} />
            {/* Ruta Pública */}
            <Route path="/login" element={<Login />} />

            {/* Rutas de roles*/}
            <Route element={<MainLayout />}>
                <Route path="/admin" element={<HomeAdmin />} />
                <Route path="/decano" element={<h1>Panel del Decano (Prueba)</h1>} />
                <Route path="/docente" element={<h1>Panel del Docente (Prueba)</h1>} />

            </Route>

            {/* Ruta de error*/}
            <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
    );
};
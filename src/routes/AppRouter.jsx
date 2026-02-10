import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// IMPORTS
import Login from '../pages/login/Login';
import HomeAdmin from '../pages/admin/HomeAdmin';
import GestorDocentes from '../pages/admin/GestorDocentes';
import OpcionTabs from '../pages/admin/OpcionTabs'; // <--- IMPORTANTE

import MainLayout from '../components/layout/MainLayout';
import LoginLayout from '../components/layout/LoginLayout';

export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />

            <Route element={<LoginLayout />}>
                <Route path="/login" element={<Login />} />
            </Route>

            <Route path="/admin" element={<MainLayout />}>
                <Route index element={<HomeAdmin />} /> 
                <Route path="docentes" element={<GestorDocentes />} />

                {/* --- ESTA ES LA RUTA NUEVA --- */}
                <Route path="academico" element={<OpcionTabs />} />
                {/* ----------------------------- */}

                <Route path="horarios" element={<div>Próximamente: Horarios</div>} />
            </Route>

            <Route path="*" element={<h1>404 - No encontrado</h1>} />
        </Routes>
    );
};
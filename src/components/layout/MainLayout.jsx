import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';

//ancho del menú lateral
const drawerWidth = 240;

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline /> 
      {/* BARRA SUPERIOR */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Sistema de Horarios
          </Typography>
        </Toolbar>
      </AppBar>

      {/* MENÚ LATERAL */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {/* Aquí irán opciones de menú dinámicas */}
            <ListItem button>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Inicio (Ejemplo)" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* CONTENIDO PRINCIPAL, donde cambian las páginas */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        
        {/* Aquí se renderiza la página que el usuario eligió (Admin, Decano, etc.) */}
        <Outlet /> 
      </Box>
    </Box>
  );
};

export default MainLayout;
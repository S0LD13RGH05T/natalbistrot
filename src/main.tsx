import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import AdminLogin from './pages/AdminLogin.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import Reservas from './pages/Reservas.tsx';
import UnitSelection from './pages/UnitSelection.tsx';
import ProtectedAdminRoute from './pages/ProtectedAdminRoute.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/campos" element={<App />} />
        <Route path="/reservar" element={<Reservas />} />
        <Route path="/campos/reservar" element={<Reservas />} />
        <Route path="/unidades" element={<UnitSelection />} />
        <Route path="/:unit" element={<App />} />
        <Route path="/:unit/reservar" element={<Reservas />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

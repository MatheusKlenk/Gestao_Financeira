import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ContasPage } from './pages/ContasPage';
import { TransacoesPage } from './pages/TransacoesPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { RequireAuth } from './routes/RequireAuth';
import { Layout } from './ui/Layout';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/contas"
          element={
            <RequireAuth>
              <ContasPage />
            </RequireAuth>
          }
        />
        <Route
          path="/transacoes"
          element={
            <RequireAuth>
              <TransacoesPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;

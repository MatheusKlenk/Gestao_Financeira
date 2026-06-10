import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../api/auth';

export function RequireAuth({ children }: { children: ReactElement }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
}


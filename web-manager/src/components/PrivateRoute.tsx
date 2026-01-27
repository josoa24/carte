import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { type ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { token, user, logout } = useAuth();
  
  // Vérifier si le token et l'utilisateur existent
  if (!token || !user) {
    // Nettoyer le localStorage si les données sont incomplètes
    if (token || user) {
      logout();
    }
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;

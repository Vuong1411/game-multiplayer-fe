import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@project/contexts/AuthContext';

interface RouteGuardProps {
    children: ReactNode;
    requiresAuth?: boolean;
}

const RouteGuard = ({ children, requiresAuth = false }: RouteGuardProps) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (requiresAuth && isAuthenticated === false && isLoading === false) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default RouteGuard;
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@project/contexts/AuthContext';

interface RouteGuardProps {
    children: ReactNode;
    requiresAuth?: boolean;
}

const RouteGuard = ({ children, requiresAuth = false }: RouteGuardProps) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // Debug logs
    // console.log('=== RouteGuard Debug ===');
    // console.log('Path:', location.pathname);
    // console.log('requiresAuth:', requiresAuth);
    // console.log('isAuthenticated:', isAuthenticated);
    // console.log('Should redirect:', requiresAuth && !isAuthenticated);

    if (requiresAuth && !isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default RouteGuard;
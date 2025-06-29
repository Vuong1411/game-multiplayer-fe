import { useAuth } from '../contexts/AuthContext';

export default function useAdmin() {
    const { currentUser } = useAuth();
    return currentUser?.role === 'admin';
}
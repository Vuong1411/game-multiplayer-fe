import useAdmin from '@project/hooks/useAdmin';
import Error403 from '@project/pages/Error/403';

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
    const isAdmin = useAdmin();
    if (!isAdmin) {
        if (!isAdmin) {
            return <Error403 />;
        }
    }
    return <>{children}</>;
}
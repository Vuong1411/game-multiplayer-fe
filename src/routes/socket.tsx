import { ReactNode } from 'react';
import { SocketProvider } from '@project/contexts/SocketContext';

interface SocketWrapperProps {
    children: ReactNode;
    requiresSocket?: boolean;
}

const SocketWrapper = ({ children, requiresSocket = false }: SocketWrapperProps) => {

    if (requiresSocket) {
        return (
            <SocketProvider>
                {children}
            </SocketProvider>
        );
    }

    return <>{children}</>;
};

export default SocketWrapper;
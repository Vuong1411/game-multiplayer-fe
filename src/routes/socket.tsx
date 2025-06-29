import { ReactNode } from 'react';
import { SocketProvider } from '@project/contexts/SocketContext';
import { GameProvider } from '@project/contexts/GameContext';

interface SocketWrapperProps {
    children: ReactNode;
    requiresSocket?: boolean;
}

const SocketWrapper = ({ children, requiresSocket = false }: SocketWrapperProps) => {

    if (requiresSocket) {
        return (
            <SocketProvider>
                <GameProvider>
                    {children}
                </GameProvider>
            </SocketProvider>
        );
    }

    return <>{children}</>;
};

export default SocketWrapper;
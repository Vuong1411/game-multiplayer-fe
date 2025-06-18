import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';
// @project
import { socketConfig } from '@project/config/socket.config';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!socketConfig.enabled) {
            console.log('Socket disabled via config');
            return;
        }
        console.log('Initializing socket connection...');

        // Kết nối WebSocket server
        const newSocket = io(socketConfig.url, socketConfig.options);

        // Xử lý sự kiện kết nối
        newSocket.on(socketConfig.events.CONNECT, () => {
            console.log('✅ Connected to WebSocket server:', newSocket.id);
            setIsConnected(true);
        });

        // Xử lý sự kiện ngắt kết nối
        newSocket.on(socketConfig.events.DISCONNECT, (reason) => {
            console.log('Disconnected from server:', reason);
            setIsConnected(false);
        });

        // Xử lý sự kiện lỗi kết nối
        newSocket.on(socketConfig.events.CONNECT_ERROR, (error) => {
            console.warn('Connection failed:', error.message);
        });

        // Xử lý sự kiện lỗi chung
        newSocket.on(socketConfig.events.ERROR, (error) => {
            console.error('Socket error:', error);
        });

        setSocket(newSocket);

        return () => {
            console.log('Cleaning up socket connection!');
            newSocket.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={{
            socket,
            isConnected,
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
import { ComponentType } from 'react';
import { MainLayout, GameLayout } from '@project/components/layout';
// Pages
import Login from '@project/pages/Login';
import Register from '@project/pages/Register';
import Home from '@project/pages/Home';
import Library from '@project/pages/Library';
import Creator from '@project/pages/Creator';
import Detail from '@project/pages/Detail';
import Join from '@project/pages/Join';
import LobbyAsync from '@project/pages/LobbyAsync';
import LobbySync from '@project/pages/LobbySync';
import GameAsync from '@project/pages/GameAsync';
import GameSync from '@project/pages/GameSync';
import ForgotpasswordPage from '@project/pages/Forgotpassword/ForgotpasswordPage';
import ResetpasswordPage from '@project/pages/Forgotpassword/ResetpasswordPage';

export interface RouteConfig {
    path: string;
    component: ComponentType;
    layout?: ComponentType<{ children: React.ReactNode }> | null;
    requiresAuth?: boolean;
    requiresSocket?: boolean;
}

const PublicRoutes: RouteConfig[] = [
    // Authentication routes
    { path: '/login', component: Login, layout: null, requiresAuth: false },
    { path: '/register', component: Register, layout: null, requiresAuth: false },
    // Main routes
    { path: '/', component: Home, layout: MainLayout, requiresAuth: false },
    { path: '/details/:id', component: Detail, layout: MainLayout, requiresAuth: false },
    { path: '/library', component: Library, layout: MainLayout, requiresAuth: true },
    { path: '/creator', component: Creator, layout: null, requiresAuth: true },
    { path: '/creator/:id', component: Creator, layout: null, requiresAuth: true },
    // Game routes
    { path: '/join', component: Join, layout: GameLayout, requiresAuth: false, requiresSocket: false },
    { path: '/lobby/solo/:id', component: LobbyAsync, layout: GameLayout, requiresAuth: false, requiresSocket: false },
    { path: '/lobby/live/:id', component: LobbySync, layout: GameLayout, requiresAuth: false, requiresSocket: true },
    { path: '/game/solo/:id', component: GameAsync, layout: GameLayout, requiresAuth: false, requiresSocket: false },
    { path: '/game/live/:id', component: GameSync, layout: GameLayout, requiresAuth: false, requiresSocket: true },

    // Quên mật khẩu
    { path: '/forgot-password', component: ForgotpasswordPage, layout: null, requiresAuth: false },
    { path: '/reset-password', component: ResetpasswordPage, layout: null, requiresAuth: false },
]

export default PublicRoutes;
import { Routes, Route } from "react-router-dom";
import { Fragment } from "react";
import RouteGuard from "./guard";
import RequireAdmin from "./admin";
import SocketWrapper from "./socket";
import PublicRoutes from "./public";
import { MainLayout } from "@project/components/layout";

import Error404 from '@project/pages/Error/404';

function wrapElement(route: any, element: React.ReactElement) {
    let wrapped = element;
    if (route.requiresAuth) {
        wrapped = <RouteGuard requiresAuth>{wrapped}</RouteGuard>;
    }
    if (route.requiresAdmin) {
        wrapped = <RequireAdmin>{wrapped}</RequireAdmin>;
    }
    if (route.requiresSocket) {
        wrapped = <SocketWrapper requiresSocket>{wrapped}</SocketWrapper>;
    }
    return wrapped;
}

const AppRoutes = () => (
    <Routes>
        {PublicRoutes.map((route, index) => {
            const Layout = route.layout === null ? Fragment : route.layout || MainLayout;
            const Component = route.component;
            const element = (
                <Layout>
                    <Component />
                </Layout>
            );
            return (
                <Route
                    key={index}
                    path={route.path}
                    element={wrapElement(route, element)}
                />
            );
        })}
        <Route path="*" element={<Error404 />} />
    </Routes>
);

export default AppRoutes;
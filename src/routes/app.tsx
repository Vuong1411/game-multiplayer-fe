import { Routes, Route, Navigate } from "react-router-dom";
import { Fragment } from "react";
import RouteGuard from "./guard";
import SocketWrapper from "./socket";
import PublicRoutes from "./public";
import { MainLayout } from "@project/components/layout";

const AppRoutes = () => {
    return (
        <Routes>
            {PublicRoutes.map((route, index) => {
                const Layout = route.layout === null ? Fragment : route.layout || MainLayout;
                const Component = route.component;

                return (
                    <Route
                        key={index}
                        path={route.path}
                        element={
                            <RouteGuard requiresAuth={route.requiresAuth}>
                                <SocketWrapper requiresSocket={route.requiresSocket}>
                                    <Layout>
                                        <Component />
                                    </Layout>
                                </SocketWrapper>
                            </RouteGuard>
                        }
                    />
                );
            })}

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
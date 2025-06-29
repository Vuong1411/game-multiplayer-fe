import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const particlesOptions = {
    key: "parallax",
    name: "Parallax",
    particles: {
        number: {
            value: 100,
            density: { enable: true },
        },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: {
            value: { min: 0.1, max: 0.5 },
            animation: { enable: true, speed: 3, sync: false },
        },
        size: {
            value: { min: 1, max: 10 },
            animation: { enable: true, speed: 20, sync: false },
        },
        links: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1,
        },
        move: {
            enable: true,
            speed: 2,
        },
    },
    interactivity: {
        events: {
            onHover: {
                enable: true,
                mode: "grab",
                parallax: { enable: true, smooth: 10, force: 60 },
            },
            onClick: { enable: true, mode: "push" },
        },
        modes: {
            grab: {
                distance: 400,
                links: { opacity: 1 },
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 0.8,
            },
            repulse: { distance: 200 },
            push: { quantity: 4 },
            remove: { quantity: 2 },
        },
    },
    background: { color: "#0d47a1" },
};

export default function Error403() {
    const [init, setInit] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => setInit(true));
    }, []);

    return (
        <Box sx={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            bgcolor: '#0d47a1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
        }}>
            {init && (
                <Particles
                    id="tsparticles"
                    options={particlesOptions}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 0
                    }}
                />
            )}
            <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#fff' }}>
                <Typography variant="h1" sx={{ fontSize: 120, fontWeight: 700, mb: 2 }}>403</Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Bạn không có quyền truy cập trang này.
                </Typography>
                <Button
                    variant="outlined"
                    sx={{ color: '#fff', borderColor: '#fff', mt: 2 }}
                    onClick={() => navigate('/')}
                >
                    Về trang chủ
                </Button>
            </Box>
        </Box>
    );
}
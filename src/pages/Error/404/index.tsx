import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import type { ISourceOptions } from "@tsparticles/engine";

export const particlesOptions: ISourceOptions = {
    key: "slow",
    name: "Slow",
    background: {
        color: "#eb263a",
    },
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
            },
        },
        color: {
            value: "#ffffff",
        },
        shape: {
            type: "circle",
        },
        opacity: {
            value: 0.5,
        },
        size: {
            value: {
                min: 1,
                max: 5,
            },
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
            speed: 6,
            direction: "none",
            outModes: { default: "out" },
            random: false,
            straight: false,
        },
    },
    interactivity: {
        events: {
            onHover: {
                enable: true,
                mode: "slow",
                parallax: {
                    enable: false,
                    force: 60,
                    smooth: 10,
                },
            },
            onClick: {
                enable: true,
                mode: "push",
            },
            resize: { enable: true },
        },
        modes: {
            slow: {
                radius: 120,
                factor: 0.05,
            },
            push: {
                quantity: 4,
            },
            grab: {
                distance: 400,
                links: {
                    opacity: 1,
                },
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 0.8,
            },
            repulse: {
                distance: 200,
            },
            remove: {
                quantity: 2,
            },
        },
    },
    fpsLimit: 120,
    detectRetina: true,
};

export default function Error404() {
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
            bgcolor: '#e53935',
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
                <Typography variant="h1" sx={{ fontSize: 160, fontWeight: 700, mb: 2 }}>404</Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Chúng tôi rất tiếc nhưng có vẻ như<br />
                    trang đó không còn tồn tại nữa.
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
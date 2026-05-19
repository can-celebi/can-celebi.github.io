// Shared background particle field for can-celebi.github.io
// Sparse, slow-drifting purple particles with thin connecting lines when close.
// Fixed full-page canvas, very low opacity, pointer-events disabled.

(function () {
    function init() {
        if (document.getElementById('bg-particles-canvas')) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'bg-particles-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.zIndex = '0';
        canvas.style.pointerEvents = 'none';
        document.body.prepend(canvas);

        // Keep the white container opaque so particles only appear in the leftover margin space.
        const containers = document.querySelectorAll('.container');
        containers.forEach(c => {
            c.style.backgroundColor = '#ffffff';
            c.style.position = 'relative';
            c.style.zIndex = '1';
        });

        const ctx = canvas.getContext('2d');
        let W = 0, H = 0, DPR = 1;
        const particles = [];
        let mouseX = -10000, mouseY = -10000;
        const REPEL_R = 130;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            mouseX = -10000;
            mouseY = -10000;
        });

        function resize() {
            DPR = window.devicePixelRatio || 1;
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W * DPR;
            canvas.height = H * DPR;
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        }

        function spawn() {
            // density scales with area; denser now since particles are only visible in margin space
            const target = Math.min(220, Math.round((W * H) / 7000));
            particles.length = 0;
            for (let i = 0; i < target; i++) {
                particles.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    vx: (Math.random() - 0.5) * 0.22,
                    vy: (Math.random() - 0.5) * 0.22,
                    r: 1.0 + Math.random() * 1.6,
                    phase: Math.random() * Math.PI * 2
                });
            }
        }

        const MAX_LINK = 130;

        function step(t) {
            ctx.clearRect(0, 0, W, H);

            for (const p of particles) {
                // cursor repulsion
                const dx = p.x - mouseX;
                const dy = p.y - mouseY;
                const d2 = dx * dx + dy * dy;
                if (d2 < REPEL_R * REPEL_R && d2 > 0.1) {
                    const d = Math.sqrt(d2);
                    const force = (REPEL_R - d) / REPEL_R * 0.17;
                    p.vx += (dx / d) * force;
                    p.vy += (dy / d) * force;
                }
                p.x += p.vx;
                p.y += p.vy;
                // gentle damping
                p.vx *= 0.985;
                p.vy *= 0.985;
                // re-energise if too slow so they don't all settle
                const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (sp < 0.08) {
                    p.vx += (Math.random() - 0.5) * 0.06;
                    p.vy += (Math.random() - 0.5) * 0.06;
                }
                if (p.x < -10) p.x = W + 10;
                if (p.x > W + 10) p.x = -10;
                if (p.y < -10) p.y = H + 10;
                if (p.y > H + 10) p.y = -10;
            }

            // connecting lines (slightly more visible since particles only show in margins)
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < MAX_LINK) {
                        const alpha = 0.14 * (1 - d / MAX_LINK);
                        ctx.strokeStyle = 'rgba(131, 72, 242,' + alpha + ')';
                        ctx.lineWidth = 0.7;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }

            // particles with a soft twinkle
            for (const p of particles) {
                const twinkle = 0.55 + 0.35 * Math.sin(t * 0.0009 + p.phase);
                ctx.fillStyle = 'rgba(131, 72, 242,' + (0.42 * twinkle) + ')';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }

            requestAnimationFrame(step);
        }

        resize();
        spawn();
        requestAnimationFrame(step);
        window.addEventListener('resize', () => { resize(); spawn(); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

import React, { useEffect, useRef } from 'react';

export default function ConfettiCanvas({ trigger = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;
    // Respect Reduced Motion setting: suppress celebratory confetti particles
    const isReducedMotion = typeof document !== 'undefined' && (
      document.documentElement.classList.contains('reduced-motion') ||
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches && !document.documentElement.classList.contains('motion-allowed'))
    );
    if (isReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#FF6B6B', '#FFE45E', '#70C1B3', '#9B5DE5', '#B8E986', '#38BDF8'];
    const particles = [];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 3,
        r: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 16,
        gravity: 0.35,
        alpha: 1,
        rotation: Math.random() * 360,
        spin: (Math.random() - 0.5) * 10
      });
    }

    let animationFrame;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.008;
        p.rotation += p.spin;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 1.5);
          ctx.restore();
        }
      });

      if (alive) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    render();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [trigger]);

  if (!trigger) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
}

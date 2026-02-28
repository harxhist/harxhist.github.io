"use client";

import { useEffect, useRef } from "react";

const CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const RAIN_OPACITY = 0.2;

const RAIN_SPEED = 0.5; 

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let columns: number;
    const fontSize = 30;
    const drops: number[] = [];

    let lastTime = 0;
    const baseFPS = 30; // 30 FPS 
    const targetFPS = baseFPS * RAIN_SPEED;
    const interval = 1000 / targetFPS; 

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops.length = 0;
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -50;
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      
      // The fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Lead character brighter
        ctx.fillStyle = `rgba(0, 255, 65, ${RAIN_OPACITY})`;
        ctx.fillText(char, x, y);

        // Trail: dimmer greens
        ctx.fillStyle = `rgba(0, 255, 65, ${0.4 * RAIN_OPACITY})`;
        ctx.fillText(
          CHARS[Math.floor(Math.random() * CHARS.length)],
          x,
          y - fontSize
        );
        ctx.fillStyle = `rgba(0, 200, 50, ${0.15 * RAIN_OPACITY})`;
        ctx.fillText(
          CHARS[Math.floor(Math.random() * CHARS.length)],
          x,
          y - fontSize * 2
        );

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }
    }

    function loop(currentTime: number) {
      animationId = requestAnimationFrame(loop);

      const deltaTime = currentTime - lastTime;

      if (deltaTime > interval) {
        draw();
        lastTime = currentTime - (deltaTime % interval);
      }
    }

    resize();
    window.addEventListener("resize", resize);
    animationId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-rain"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
      aria-hidden
    />
  );
}
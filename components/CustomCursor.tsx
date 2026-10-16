"use client";

import { useEffect, useRef } from "react";

interface TrailPoint {
  x: number;
  y: number;
  age: number;
  maxAge: number;
}

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Hanya aktifkan pada perangkat dengan pointer presisi (mouse/touchpad, bukan touch HP)
    if (typeof window === "undefined") return;
    const isPointerFine = window.matchMedia("(pointer: fine)").matches;
    if (!isPointerFine) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let dpr = window.devicePixelRatio || 1;
    const resizeCanvas = () => {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // State kursor
    let mouseX = -100;
    let mouseY = -100;
    let prevMouseX = -100;
    let prevMouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let isVisible = false;
    let isHovering = false;
    let currentRadius = 6;
    let targetRadius = 6;
    let opacity = 0;

    const trail: TrailPoint[] = [];
    const MAX_TRAIL_AGE = 26; // Jejak lebih singkat dan ringan agar tidak mengganggu

    // Deteksi interaksi mouse
    const onMouseMove = (e: MouseEvent) => {
      const nextX = e.clientX;
      const nextY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        currentX = nextX;
        currentY = nextY;
        prevMouseX = nextX;
        prevMouseY = nextY;
      }

      mouseX = nextX;
      mouseY = nextY;

      // Cek apakah sedang hover di atas elemen interaktif (link/button)
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("a") ||
          target.closest("button") ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest(".project-item") ||
          target.closest(".projects__tab") ||
          target.closest('[role="button"]') ||
          target.closest('[role="tab"]'))
      ) {
        isHovering = true;
      } else {
        isHovering = false;
      }

      // Interpolasi titik-titik jejak secara proporsional
      if (prevMouseX > 0 && prevMouseY > 0) {
        const dx = mouseX - prevMouseX;
        const dy = mouseY - prevMouseY;
        const dist = Math.hypot(dx, dy);
        const steps = Math.min(Math.ceil(dist / 5), 12);

        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          trail.push({
            x: prevMouseX + dx * t,
            y: prevMouseY + dy * t,
            age: 0,
            maxAge: MAX_TRAIL_AGE,
          });
        }
      }

      prevMouseX = mouseX;
      prevMouseY = mouseY;
    };

    const onMouseLeave = () => {
      isVisible = false;
      isHovering = false;
    };

    const onMouseEnter = () => {
      isVisible = true;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    let rafId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Lerp posisi kepala kursor agar halus
      currentX += (mouseX - currentX) * 0.75;
      currentY += (mouseY - currentY) * 0.75;

      // Lerp ukuran radius kursor saat hover
      targetRadius = isHovering ? 10 : 6;
      currentRadius += (targetRadius - currentRadius) * 0.2;

      // Lerp opacity saat masuk/keluar layar
      opacity += ((isVisible ? 1 : 0) - opacity) * 0.15;

      // ── 1. Update usia jejak ──
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.age++;
        if (p.age >= p.maxAge) {
          trail.splice(i, 1);
        }
      }

      // ── 2. Gambar garis jejak tipis dan halus (Subtle Whisper Trail) ──
      if (trail.length > 1) {
        ctx.save();
        for (let i = 1; i < trail.length; i++) {
          const pPrev = trail[i - 1];
          const pCurr = trail[i];
          const progress = 1 - pCurr.age / pCurr.maxAge; // 1 = baru, 0 = tua

          // Ketebalan ramping: maksimal 2px dan meruncing ke 0.4px
          const lineWidth = Math.max(0.4, 5 * Math.pow(progress, 1.4));
          // Transparansi lembut: maksimal 0.12 agar tidak menutupi tulisan
          const lineAlpha = 0.16 * Math.pow(progress, 1.6) * opacity;

          ctx.beginPath();
          ctx.moveTo(pPrev.x, pPrev.y);
          ctx.lineTo(pCurr.x, pCurr.y);
          ctx.strokeStyle = `rgba(0, 0, 0, ${lineAlpha})`;
          ctx.lineWidth = lineWidth;
          ctx.lineCap = "round";
          ctx.stroke();
        }
        ctx.restore();
      }

      // ── 3. Gambar bulatan hitam bercahaya (Glowing Head Cursor) ──
      if (opacity > 0.01 && currentX > -50 && currentY > -50) {
        ctx.save();

        // Cahaya luar lembut (Ambient Outer Glow)
        const glowRadius = currentRadius * 3.2;
        const glowGrad = ctx.createRadialGradient(
          currentX,
          currentY,
          currentRadius * 0.5,
          currentX,
          currentY,
          glowRadius
        );
        glowGrad.addColorStop(0, `rgba(0, 0, 0, ${0.35 * opacity})`);
        glowGrad.addColorStop(0.5, `rgba(0, 0, 0, ${0.12 * opacity})`);
        glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.beginPath();
        ctx.arc(currentX, currentY, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Lingkaran inti hitam pekat bercahaya (Black Core with Shadow Glow)
        ctx.beginPath();
        ctx.arc(currentX, currentY, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        ctx.shadowColor = `rgba(0, 0, 0, ${0.65 * opacity})`;
        ctx.shadowBlur = isHovering ? 18 : 12;
        ctx.fill();

        // Ring aura tipis saat hovering elemen interaktif
        if (isHovering) {
          ctx.beginPath();
          ctx.arc(currentX, currentY, currentRadius + 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 0, 0, ${0.35 * opacity})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="custom-cursor-canvas"
      aria-hidden="true"
    />
  );
}

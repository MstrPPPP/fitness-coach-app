"use client";

import { useEffect, useRef, useCallback } from "react";
import { LevelDisplay } from "./LevelDisplay";
import { cn } from "@/lib/utils";

interface LevelUpCelebrationProps {
  newLevel: number;
  isVisible: boolean;
  onDismiss: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
  opacity: number;
}

const COLORS: readonly string[] = [
  "hsl(138, 17%, 35%)", // sage
  "hsl(45, 80%, 50%)", // gold
  "hsl(30, 60%, 50%)", // bronze
  "hsl(200, 100%, 70%)", // diamond
  "hsl(20, 90%, 55%)", // flame
] as const;

const DEFAULT_COLOR = "hsl(138, 17%, 35%)";

export function LevelUpCelebration({
  newLevel,
  isVisible,
  onDismiss,
}: LevelUpCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  const createParticles = useCallback(() => {
    const particles: Particle[] = [];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? DEFAULT_COLOR,
        size: Math.random() * 8 + 4,
        opacity: 1,
      });
    }

    particlesRef.current = particles;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activeParticles = 0;

    particlesRef.current.forEach((particle) => {
      if (particle.opacity <= 0) return;

      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.1; // gravity
      particle.rotation += particle.rotationSpeed;
      particle.opacity -= 0.005;

      if (particle.y > canvas.height) {
        particle.opacity = 0;
      }

      if (particle.opacity > 0) {
        activeParticles++;

        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;

        // Draw a rectangle (confetti piece)
        ctx.fillRect(
          -particle.size / 2,
          -particle.size / 4,
          particle.size,
          particle.size / 2
        );

        ctx.restore();
      }
    });

    if (activeParticles > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Start confetti
    createParticles();
    animate();

    // Auto-dismiss after 4 seconds
    const timer = setTimeout(onDismiss, 4000);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, createParticles, animate, onDismiss]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onDismiss}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm fade-in" />

      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Content */}
      <div
        className={cn(
          "relative z-10 text-center slide-up",
          "bg-white rounded-2xl p-8 shadow-2xl",
          "max-w-sm mx-4"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-[hsl(var(--sage-800))] mb-2 level-up-animate">
          Level Up!
        </h2>
        <p className="text-muted-foreground mb-6">
          Congratulations on your progress!
        </p>

        <LevelDisplay level={newLevel} size="lg" />

        <button
          onClick={onDismiss}
          className={cn(
            "mt-6 px-6 py-2 rounded-full",
            "bg-[hsl(var(--sage-600))] text-white",
            "hover:bg-[hsl(var(--sage-700))] transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sage-400))] focus:ring-offset-2"
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Moon, Sun, Sunrise, Sunset, CloudMoon } from "lucide-react";

type TimeOfDay = "Pre-dawn" | "Sunrise" | "Daytime" | "Dusk" | "Sunset";

const THEMES = {
  "Pre-dawn": {
    bg: "from-zinc-950 via-[#1e103c] to-zinc-950",
    glow1: "bg-purple-900/40",
    glow2: "bg-indigo-900/30",
    // Bright neon colors for maximum visibility
    particles: ['#a855f7', '#d946ef', '#3b82f6', '#ec4899', '#6366f1'],
    icon: <Moon className="w-4 h-4" />
  },
  "Sunrise": {
    bg: "from-[#2e1042] via-[#5c255e] to-[#c75e63]",
    glow1: "bg-orange-500/30",
    glow2: "bg-pink-500/20",
    particles: ['#fb923c', '#f43f5e', '#ec4899', '#d946ef', '#fcd34d'],
    icon: <Sunrise className="w-4 h-4" />
  },
  "Daytime": {
    bg: "from-white via-[#f8fafc] to-white",
    glow1: "bg-purple-100",
    glow2: "bg-pink-50",
    particles: ['#8b5cf6', '#a855f7', '#d946ef', '#6366f1', '#ec4899'],
    icon: <Sun className="w-4 h-4" />
  },
  "Dusk": {
    bg: "from-[#eab308] via-[#ea580c] to-[#9f1239]",
    glow1: "bg-orange-600/40",
    glow2: "bg-red-600/30",
    particles: ['#fef08a', '#fdba74', '#f87171', '#fcd34d', '#fbbf24'],
    icon: <Sunset className="w-4 h-4" />
  },
  "Sunset": {
    bg: "from-[#581c87] via-[#9d174d] to-[#4c1d95]",
    glow1: "bg-pink-600/30",
    glow2: "bg-purple-600/20",
    particles: ['#f9a8d4', '#fbcfe8', '#c084fc', '#e879f9', '#f472b6'],
    icon: <CloudMoon className="w-4 h-4" />
  }
};

export const ParticleBurst = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("Pre-dawn");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Use a ref to access the current theme colors inside the animation loop without restarting it
  const currentColorsRef = useRef(THEMES["Pre-dawn"].particles);

  useEffect(() => {
    currentColorsRef.current = THEMES[timeOfDay].particles;
  }, [timeOfDay]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Mouse interaction state
    let mouse = { x: -1000, y: -1000, radius: 10 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    class Particle {
      x: number;
      y: number;
      baseAngle: number;
      angle: number;
      speed: number;
      length: number;
      alpha: number;
      color: string;
      thickness: number;
      distance: number;

      constructor() {
        const isMouseActive = mouse.x !== -1000;
        // If mouse is active, the fountain origin follows the mouse horizontally!
        this.x = isMouseActive ? mouse.x : canvas!.width / 2;
        this.y = canvas!.height;

        this.baseAngle = Math.PI + Math.random() * Math.PI;
        this.angle = this.baseAngle;
        // Significantly increased speed for faster bursts
        this.speed = 2.5 + Math.random() * 6.0;
        this.length = 20 + Math.random() * 100;

        // Start with much higher opacity for visibility
        this.alpha = Math.random() * 0.4 + 0.6;

        const colors = currentColorsRef.current;
        this.color = colors[Math.floor(Math.random() * colors.length)];

        // Slightly thicker lines
        this.thickness = Math.random() * 1.2 + 0.5;
        this.distance = 0;
      }

      update() {
        this.distance += this.speed;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distanceToMouse < mouse.radius) {
          const forceDirectionX = dx / distanceToMouse;
          const forceDirectionY = dy / distanceToMouse;
          const force = (mouse.radius - distanceToMouse) / mouse.radius;

          this.x -= forceDirectionX * force * 5;
          this.y -= forceDirectionY * force * 5;
          this.angle += (Math.random() - 0.5) * force * 0.5;
        } else {
          this.angle += (this.baseAngle - this.angle) * 0.05;
        }

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        this.alpha -= 0.0015;
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.alpha <= 0) return;

        ctx.save();
        ctx.globalAlpha = this.alpha;

        // Add extreme glow to the particles
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
          this.x - Math.cos(this.angle) * this.length,
          this.y - Math.sin(this.angle) * this.length
        );
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.thickness;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.thickness * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.restore();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 200; i++) {
        particles.push(new Particle());
        particles[i].distance = Math.random() * 1000;
        particles[i].x += Math.cos(particles[i].angle) * particles[i].distance;
        particles[i].y += Math.sin(particles[i].angle) * particles[i].distance;
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.7) {
        for (let i = 0; i < 8; i++) particles.push(new Particle());
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);

        if (particles[i].alpha <= 0 || particles[i].x < 0 || particles[i].x > canvas.width || particles[i].y < 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const theme = THEMES[timeOfDay];
  const isLight = timeOfDay === "Daytime";

  return (
    <div className={`absolute inset-0 overflow-hidden z-0 pointer-events-auto transition-colors duration-1000 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
      {/* Background Gradients */}
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.bg} opacity-90 pointer-events-none transition-colors duration-1000`} />
      <div className={`absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[100vw] h-[80vh] ${theme.glow1} rounded-[100%] blur-[120px] pointer-events-none transition-colors duration-1000`} />
      <div className={`absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[60vw] h-[40vh] ${theme.glow2} rounded-[100%] blur-[100px] pointer-events-none transition-colors duration-1000`} />

      {/* Canvas */}
      <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full opacity-100 cursor-crosshair mix-blend-screen`} />

      {/* Bottom Fade */}
      <div className={`absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t ${isLight ? 'from-white' : 'from-zinc-950'} to-transparent pointer-events-none transition-colors duration-1000`} />

      {/* Time of Day Selector UI */}
      <div className="absolute top-8 right-8 z-50">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all backdrop-blur-md shadow-lg ${isLight
                ? 'bg-white/80 border-zinc-200 text-zinc-800 hover:bg-zinc-50'
                : 'bg-zinc-900/80 border-zinc-700/50 text-white hover:bg-zinc-800'
              }`}
          >
            {theme.icon}
            <span>{timeOfDay}</span>
          </button>

          {isDropdownOpen && (
            <div className={`absolute top-full right-0 mt-2 w-48 rounded-2xl border shadow-xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 ${isLight
                ? 'bg-white/90 border-zinc-200'
                : 'bg-zinc-900/90 border-zinc-700/50'
              }`}>
              {(Object.keys(THEMES) as TimeOfDay[]).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTimeOfDay(t);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-3 ${timeOfDay === t
                      ? (isLight ? 'bg-indigo-50 text-indigo-600' : 'bg-white/10 text-white')
                      : (isLight ? 'text-zinc-600 hover:bg-zinc-50' : 'text-zinc-400 hover:bg-white/5 hover:text-white')
                    }`}
                >
                  {THEMES[t].icon}
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

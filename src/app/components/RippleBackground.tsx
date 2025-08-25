"use client";

import { useEffect, useRef } from 'react';

// Utility functions
const TAU = Math.PI * 2;
const rand = (n: number) => Math.random() * n;
const randIn = (min: number, max: number) => Math.random() * (max - min) + min;
const cos = Math.cos;
const sin = Math.sin;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const fadeInOut = (t: number, d: number) => {
  const x = t / d;
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
};

// Simplex Noise implementation
class SimplexNoise {
  private perm: number[];
  
  constructor() {
    this.perm = new Array(512);
    for (let i = 0; i < 512; i++) {
      this.perm[i] = Math.floor(Math.random() * 256);
    }
  }
  
  noise3D(x: number, y: number, z: number): number {
    return (Math.sin(x * 10) + Math.sin(y * 10) + Math.sin(z * 10)) / 3;
  }
}

export default function RippleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    console.log('RippleBackground mounting...');
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Create buffer canvas
    const bufferCanvas = document.createElement('canvas');
    const bufferCtx = bufferCanvas.getContext('2d')!;
    const mainCtx = canvas.getContext('2d')!;
    
    const particleCount = 2000;
    const particlePropCount = 9;
    const particlePropsLength = particleCount * particlePropCount;
    const spawnRadius = rand(900) + 500;
    const noiseSteps = 6;
    
    let center: [number, number];
    let tick: number;
    let simplex: SimplexNoise;
    let particleProps: Float32Array;
    let buffer: CanvasRenderingContext2D = bufferCtx;
    let ctx: CanvasRenderingContext2D = mainCtx;

    function setup() {
      tick = 0;
      center = [0, 0];
      resize();
      createParticles();
      draw();
    }

    function createParticles() {
      simplex = new SimplexNoise();
      particleProps = new Float32Array(particleCount * particlePropCount);
      
      let i;
      
      for (i = 0; i < particleCount; i++) {
        initParticle(i);
      }
    }

    function initParticle(i: number) {
      let iy, ih, rd, rt, cx, sy, x, y, s, rv, vx, vy, t, h, w, l, ttl;
      
      iy = i + 1;
      ih = 0.5 * i | 0;
      rd = rand(spawnRadius);
      rt = rand(TAU);
      cx = cos(rt);
      sy = sin(rt);
      x = center[0] + cx * rd;
      y = center[1] + sy * rd;
      rv = randIn(0.1, 1);
      s = randIn(1, 8);
      vx = rv * cx * 0.1;
      vy = rv * sy * 0.1;
      w = randIn(0.1, 2);
      // Remove h (hue) since we want white color
      l = 0;
      ttl = randIn(50, 200);
      
      const startIndex = i * particlePropCount;
      particleProps[startIndex] = x;
      particleProps[startIndex + 1] = y;
      particleProps[startIndex + 2] = vx;
      particleProps[startIndex + 3] = vy;
      particleProps[startIndex + 4] = s;
      particleProps[startIndex + 5] = 0; // h is no longer used
      particleProps[startIndex + 6] = w;
      particleProps[startIndex + 7] = l;
      particleProps[startIndex + 8] = ttl;
    }

    function drawParticle(i: number) {
      let n, dx, dy, dl, c;
      const startIndex = i * particlePropCount;
      const x = particleProps[startIndex];
      const y = particleProps[startIndex + 1];
      const vx = particleProps[startIndex + 2];
      const vy = particleProps[startIndex + 3];
      const s = particleProps[startIndex + 4];
      const w = particleProps[startIndex + 6];
      const l = particleProps[startIndex + 7];
      const ttl = particleProps[startIndex + 8];
      
      n = simplex.noise3D(x * 0.0025, y * 0.0025, tick * 0.0005) * TAU * noiseSteps;
      const newVx = lerp(vx, cos(n), 0.05);
      const newVy = lerp(vy, sin(n), 0.05);
      dx = x + newVx * s;
      dy = y + newVy * s;
      dl = fadeInOut(l, ttl);
      
      // Use white color with varying opacity
      c = `rgba(255, 255, 255, ${dl * 0.8})`;

      const newL = l + 1;

      buffer.save();
      buffer.lineWidth = (dl * w + 1) * 0.3;
      buffer.strokeStyle = c;
      buffer.beginPath();
      buffer.moveTo(x, y);
      buffer.lineTo(dx, dy);
      buffer.stroke();
      buffer.closePath();
      buffer.restore();
      
      // Update particle properties
      particleProps[startIndex] = dx;
      particleProps[startIndex + 1] = dy;
      particleProps[startIndex + 2] = newVx;
      particleProps[startIndex + 3] = newVy;
      particleProps[startIndex + 4] = s;
      particleProps[startIndex + 5] = 0; // h is no longer used
      particleProps[startIndex + 6] = w;
      particleProps[startIndex + 7] = newL;
      particleProps[startIndex + 8] = ttl;

      if (checkBounds(x, y) || newL > ttl) {
        initParticle(i);
      }
    }

    function checkBounds(x: number, y: number) {
      return (
        x > buffer.canvas.width ||
        x < 0 ||
        y > buffer.canvas.height ||
        y < 0
      );
    }

    function resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      buffer.canvas.width = width;
      buffer.canvas.height = height;
      ctx.canvas.width = width;
      ctx.canvas.height = height;
      
      center[0] = 0.5 * width;
      center[1] = 0.5 * height;
    }

    function draw() {
      tick++;
      buffer.clearRect(0, 0, buffer.canvas.width, buffer.canvas.height);
      
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      
      let i = 0;
      
      for (; i < particleCount; i++) {
        drawParticle(i);
      }
      
      ctx.save();
      ctx.filter = 'blur(8px)';
      ctx.globalCompositeOperation = 'lighten';
      ctx.drawImage(buffer.canvas, 0, 0);
      ctx.restore();
      
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.drawImage(buffer.canvas, 0, 0);
      ctx.restore();
      
      animationRef.current = window.requestAnimationFrame(draw);
    }

    // Initialize
    setup();
    
    // Handle resize
    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      console.log('RippleBackground unmounting...');
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none"
      style={{ 
        zIndex: -1,
        width: '100vw',
        height: '100vh'
      }}
    />
  );
}

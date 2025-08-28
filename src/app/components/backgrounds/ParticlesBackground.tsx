"use client";

import { useEffect, useRef } from 'react';

interface Particle {
  hue: number;
  sat: number;
  lum: number;
  x: number;
  y: number;
  xLast: number;
  yLast: number;
  xSpeed: number;
  ySpeed: number;
  age: number;
  ageSinceStuck: number;
  attractor: {
    oldIndex: number;
    gridSpotIndex: number;
  };
  name: string;
  speed?: number;
  dist?: number;
}

interface GridSpot {
  x: number;
  y: number;
  busyAge: number;
  spotIndex: number;
  isEdge: string | boolean;
  field: number;
}

interface AppState {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  xC: number;
  yC: number;
  stepCount: number;
  particles: Particle[];
  lifespan: number;
  popPerBirth: number;
  maxPop: number;
  birthFreq: number;
  gridSize: number;
  gridSteps: number;
  grid: GridSpot[];
  gridMaxIndex: number;
  drawnInLastFrame: number;
  deathCount: number;
  dataToImageRatio: number;
}

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<AppState | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize app state
    const app: AppState = {
      canvas,
      ctx,
      filename: "spipa",
      width: window.innerWidth,
      height: window.innerHeight,
      xC: window.innerWidth / 2,
      yC: window.innerHeight / 2,
      stepCount: 0,
      particles: [],
      lifespan: 1000,
      popPerBirth: 1,
      maxPop: 300,
      birthFreq: 2,
      gridSize: 8,
      gridSteps: Math.floor(1000 / 8),
      grid: [],
      gridMaxIndex: 0,
      drawnInLastFrame: 0,
      deathCount: 0,
      dataToImageRatio: 1
    };

    appRef.current = app;

    // Build grid
    let i = 0;
    for (let xx = -500; xx < 500; xx += app.gridSize) {
      for (let yy = -500; yy < 500; yy += app.gridSize) {
        const r = Math.sqrt(xx * xx + yy * yy);
        const r0 = 100;
        let field: number;
        
        if (r < r0) field = 255 / r0 * r;
        else if (r > r0) field = 255 - Math.min(255, (r - r0) / 2);
        else field = 255;
        
        app.grid.push({
          x: xx,
          y: yy,
          busyAge: 0,
          spotIndex: i,
          isEdge: (xx === -500 ? 'left' : 
                   (xx === (-500 + app.gridSize * (app.gridSteps - 1)) ? 'right' : 
                    (yy === -500 ? 'top' : 
                     (yy === (-500 + app.gridSize * (app.gridSteps - 1)) ? 'bottom' : 
                      false
                     )
                    )
                   )
                  ),
          field: field
        });
        i++;
      }
    }
    app.gridMaxIndex = i;

    // Set canvas size
    canvas.width = app.width;
    canvas.height = app.height;
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;

    // Initialize drawing
    ctx.beginPath();
    ctx.rect(0, 0, app.width, app.height);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();

    // Helper functions
    const birth = () => {
      if (app.particles.length + app.popPerBirth >= app.maxPop) return;
      
      const gridSpotIndex = Math.floor(Math.random() * app.gridMaxIndex);
      const gridSpot = app.grid[gridSpotIndex];
      const x = gridSpot.x;
      const y = gridSpot.y;

      const particle: Particle = {
        hue: 200,
        sat: 95,
        lum: 20 + Math.floor(40 * Math.random()),
        x: x,
        y: y,
        xLast: x,
        yLast: y,
        xSpeed: 0,
        ySpeed: 0,
        age: 0,
        ageSinceStuck: 0,
        attractor: {
          oldIndex: gridSpotIndex,
          gridSpotIndex: gridSpotIndex,
        },
        name: 'seed-' + Math.ceil(10000000 * Math.random())
      };
      app.particles.push(particle);
    };

    const kill = (particleName: string) => {
      app.particles = app.particles.filter(seed => seed.name !== particleName);
    };

    const move = () => {
      for (let i = 0; i < app.particles.length; i++) {
        const p = app.particles[i];
        
        p.xLast = p.x;
        p.yLast = p.y;
        
        const index = p.attractor.gridSpotIndex;
        const gridSpot = app.grid[index];
        
        if (Math.random() < 0.5) {
          if (!gridSpot.isEdge) {
            const topIndex = index - 1;
            const bottomIndex = index + 1;
            const leftIndex = index - app.gridSteps;
            const rightIndex = index + app.gridSteps;
            const topSpot = app.grid[topIndex];
            const bottomSpot = app.grid[bottomIndex];
            const leftSpot = app.grid[leftIndex];
            const rightSpot = app.grid[rightIndex];
            
            const chaos = 30;
            const neighbors = [topSpot, bottomSpot, leftSpot, rightSpot].filter(Boolean);
            const maxFieldSpot = neighbors.reduce((max, spot) => 
              (spot.field + chaos * Math.random()) > (max.field + chaos * Math.random()) ? spot : max
            );
            
            if (maxFieldSpot.busyAge === 0 || maxFieldSpot.busyAge > 15) {
              p.ageSinceStuck = 0;
              p.attractor.oldIndex = index;
              p.attractor.gridSpotIndex = maxFieldSpot.spotIndex;
              maxFieldSpot.busyAge = 1;
            } else {
              p.ageSinceStuck++;
            }
          } else {
            p.ageSinceStuck++;
          }
          
          if (p.ageSinceStuck === 10) {
            kill(p.name);
            app.deathCount++;
          }
        }
        
        const k = 8;
        const visc = 0.4;
        const dx = p.x - gridSpot.x;
        const dy = p.y - gridSpot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const xAcc = -k * dx;
        const yAcc = -k * dy;
        
        p.xSpeed += xAcc;
        p.ySpeed += yAcc;
        
        p.xSpeed *= visc;
        p.ySpeed *= visc;
        
        p.speed = Math.sqrt(p.xSpeed * p.xSpeed + p.ySpeed * p.ySpeed);
        p.dist = dist;
        
        p.x += 0.1 * p.xSpeed;
        p.y += 0.1 * p.ySpeed;
        
        p.age++;
        
        if (p.age > app.lifespan) {
          kill(p.name);
          app.deathCount++;
        }
      }
    };

    const draw = () => {
      app.drawnInLastFrame = 0;
      if (!app.particles.length) return false;
      
      ctx.beginPath();
      ctx.rect(0, 0, app.width, app.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fill();
      ctx.closePath();
      
      for (let i = 0; i < app.particles.length; i++) {
        const p = app.particles[i];
        
        const h = p.hue + app.stepCount / 30;
        const s = p.sat;
        const l = p.lum;
        const a = 1;
        
        const dataXYtoCanvasXY = (x: number, y: number) => {
          const zoom = 1.6;
          const xx = app.xC + x * zoom * app.dataToImageRatio;
          const yy = app.yC + y * zoom * app.dataToImageRatio;
          return { x: xx, y: yy };
        };
        
        const last = dataXYtoCanvasXY(p.xLast, p.yLast);
        const now = dataXYtoCanvasXY(p.x, p.y);
        const attracSpot = app.grid[p.attractor.gridSpotIndex];
        const attracXY = dataXYtoCanvasXY(attracSpot.x, attracSpot.y);
        const oldAttracSpot = app.grid[p.attractor.oldIndex];
        const oldAttracXY = dataXYtoCanvasXY(oldAttracSpot.x, oldAttracSpot.y);
        
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${h}, ${s}%, ${l}%, ${a})`;
        ctx.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${a})`;
        
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(now.x, now.y);
        ctx.lineWidth = 1.5 * app.dataToImageRatio;
        ctx.stroke();
        ctx.closePath();
        
        ctx.beginPath();
        ctx.lineWidth = 1.5 * app.dataToImageRatio;
        ctx.moveTo(oldAttracXY.x, oldAttracXY.y);
        ctx.lineTo(attracXY.x, attracXY.y);
        ctx.arc(attracXY.x, attracXY.y, 1.5 * app.dataToImageRatio, 0, 2 * Math.PI, false);
        
        ctx.strokeStyle = `hsla(${h}, ${s}%, ${l}%, ${a})`;
        ctx.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${a})`;
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        
        app.drawnInLastFrame++;
      }
    };

    const evolve = () => {
      app.stepCount++;
      
      app.grid.forEach(e => {
        if (e.busyAge > 0) e.busyAge++;
      });
      
      if (app.stepCount % app.birthFreq === 0 && (app.particles.length + app.popPerBirth) < app.maxPop) {
        birth();
      }
      
      move();
      draw();
    };

    const animate = () => {
      evolve();
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (appRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const app = appRef.current;
        
        app.width = window.innerWidth;
        app.height = window.innerHeight;
        app.xC = window.innerWidth / 2;
        app.yC = window.innerHeight / 2;
        
        canvas.width = app.width;
        canvas.height = app.height;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
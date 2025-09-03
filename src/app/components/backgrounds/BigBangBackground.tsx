'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import RippleBackground from './RippleBackground';

export default function BigBangBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showRipple, setShowRipple] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!canvasRef.current || showRipple) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = null;
    sceneRef.current = scene;

    const count = 128 ** 2;

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: false,
      depth: true,
      stencil: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.autoClear = false;
    renderer.sortObjects = false;
    rendererRef.current = renderer;

    // ------------------------ //
    // STAR ALPHA TEXTURE

    const ctx = document.createElement('canvas').getContext('2d')!;
    ctx.canvas.width = ctx.canvas.height = 32;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 32, 32);

    let grd = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grd.addColorStop(0.0, '#fff');
    grd.addColorStop(1.0, '#000');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.rect(15, 0, 2, 32);
    ctx.fill();
    ctx.beginPath();
    ctx.rect(0, 15, 32, 2);
    ctx.fill();

    grd = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grd.addColorStop(0.1, '#ffff');
    grd.addColorStop(0.6, '#0000');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 32, 32);

    const alphaMap = new THREE.CanvasTexture(ctx.canvas);

    // ------------------------ //
    // GALAXY

    const galaxyGeometry = new THREE.BufferGeometry();

    const galaxyPosition = new Float32Array(count * 3);
    const galaxySeed = new Float32Array(count * 3);
    const galaxySize = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      galaxyPosition[i * 3] = i / count;
      galaxySeed[i * 3 + 0] = Math.random();
      galaxySeed[i * 3 + 1] = Math.random();
      galaxySeed[i * 3 + 2] = Math.random();
      galaxySize[i] = Math.random() * 2 + 0.5;
    }

    galaxyGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(galaxyPosition, 3)
    );
    galaxyGeometry.setAttribute(
      'size',
      new THREE.BufferAttribute(galaxySize, 1)
    );
    galaxyGeometry.setAttribute(
      'seed',
      new THREE.BufferAttribute(galaxySeed, 3)
    );

    const innColor = new THREE.Color('#ff8c00'); // Nice orange center
    const outColor = new THREE.Color('#ff8c00'); // Orange outer stars too

    const galaxyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: renderer.getPixelRatio() },
        uBranches: { value: 2 },
        uRadius: { value: 0 },
        uSpin: { value: Math.PI * 0.25 },
        uRandomness: { value: 0 },
        uAlphaMap: { value: alphaMap },
        uColorInn: { value: innColor },
        uColorOut: { value: outColor },
      },
      vertexShader: `
        precision highp float;

        attribute float size;
        attribute vec3 seed;
        uniform float uTime;
        uniform float uSize;
        uniform float uBranches;
        uniform float uRadius;
        uniform float uSpin;
        uniform float uRandomness;

        varying float vDistance;

        #define PI  3.14159265359
        #define PI2 6.28318530718

        float random (vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        vec3 scatter (vec3 seed) {
          float u = random(seed.xy);
          float v = random(seed.yz);
          float theta = u * 6.28318530718;
          float phi = acos(2.0 * v - 1.0);

          float sinTheta = sin(theta);
          float cosTheta = cos(theta);
          float sinPhi = sin(phi);
          float cosPhi = cos(phi);

          float x = sinPhi * cosTheta;
          float y = sinPhi * sinTheta;
          float z = cosPhi;

          return vec3(x, y, z);
        }

        void main() {
          vec3 p = position;
          float st = sqrt(p.x);
          float qt = p.x * p.x;
          float mt = mix(st, qt, p.x);

          // Offset positions by spin (farther wider) and branch num
          float angle = qt * uSpin * (2.0 - sqrt(1.0 - qt));
          float branchOffset = (PI2 / uBranches) * floor(seed.x * uBranches);
          p.x = position.x * cos(angle + branchOffset) * uRadius;
          p.z = position.x * sin(angle + branchOffset) * uRadius;

          // Scatter positions & scale down by Y-axis
          p += scatter(seed) * random(seed.zx) * uRandomness * mt;
          p.y *= 0.5 + qt * 0.5;

          // Rotate (center faster)
          vec3 temp = p;
          float ac = cos(-uTime * (2.0 - st) * 0.5);
          float as = sin(-uTime * (2.0 - st) * 0.5);
          p.x = temp.x * ac - temp.z * as;
          p.z = temp.x * as + temp.z * ac;

          vDistance = mt;

          vec4 mvp = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mvp;
          gl_PointSize = (10.0 * size * uSize) / -mvp.z;
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform vec3 uColorInn;
        uniform vec3 uColorOut;
        uniform sampler2D uAlphaMap;

        varying float vDistance;

        #define PI  3.14159265359

        void main() {
          vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
          float a = texture2D(uAlphaMap, uv).g;
          if (a < 0.1) discard;

          vec3 color = mix(uColorInn, uColorOut, vDistance);
          // Remove white highlights to keep stars fully orange
          // float c = step(0.99, (sin(gl_PointCoord.x * PI) + sin(gl_PointCoord.y * PI)) * 0.5);
          // color = max(color, vec3(c));

          gl_FragColor = vec4(color, a);
        }
      `,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
    scene.add(galaxy);

    // ------------------------ //
    // UNIVERSE

    const universeGeometry = new THREE.BufferGeometry();

    const universePosition = new Float32Array((count * 3) / 2);
    const universeSeed = new Float32Array((count * 3) / 2);
    const universeSize = new Float32Array(count / 2);

    for (let i = 0; i < count / 2; i++) {
      universeSeed[i * 3 + 0] = Math.random();
      universeSeed[i * 3 + 1] = Math.random();
      universeSeed[i * 3 + 2] = Math.random();
      universeSize[i] = Math.random() * 2 + 0.5;
    }

    universeGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(universePosition, 3)
    );
    universeGeometry.setAttribute(
      'seed',
      new THREE.BufferAttribute(universeSeed, 3)
    );
    universeGeometry.setAttribute(
      'size',
      new THREE.BufferAttribute(universeSize, 1)
    );

    const universeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: galaxyMaterial.uniforms.uSize,
        uRadius: galaxyMaterial.uniforms.uRadius,
        uAlphaMap: galaxyMaterial.uniforms.uAlphaMap,
      },
      vertexShader: `
        precision highp float;

        attribute vec3 seed;
        attribute float size;
        uniform float uTime;
        uniform float uSize;
        uniform float uRadius;

        #define PI  3.14159265359
        #define PI2 6.28318530718

        float random (vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        vec3 scatter (vec3 seed) {
          float u = random(seed.xy);
          float v = random(seed.yz);
          float theta = u * 6.28318530718;
          float phi = acos(2.0 * v - 1.0);

          float sinTheta = sin(theta);
          float cosTheta = cos(theta);
          float sinPhi = sin(phi);
          float cosPhi = cos(phi);

          float x = sinPhi * cosTheta;
          float y = sinPhi * sinTheta;
          float z = cosPhi;

          return vec3(x, y, z);
        }

        void main() {
          vec3 p = scatter(seed) * 3.0 * vec3(2.1, 1.3, 2.1);

          // Sweep to center
          float q = random(seed.zx);
          for (int i = 0; i < 3; i++) q *= q;
          p *= q;

          // Sweep to surface
          float l = length(p) / (2.1 * 3.0);
          p = l < 0.001 ? (p / l) : p;

          // Rotate (center faster)
          vec3 temp = p;
          float ql = 1.0 - l;
          for (int i = 0; i < 3; i++) ql *= ql;
          float ac = cos(-uTime * ql);
          float as = sin(-uTime * ql);
          p.x = temp.x * ac - temp.z * as;
          p.z = temp.x * as + temp.z * ac;

          vec4 mvp = modelViewMatrix * vec4(p * uRadius, 1.0);
          gl_Position = projectionMatrix * mvp;

          // Scale up core stars
          l = (2.0 - l) * (2.0 - l);

          gl_PointSize = (3.0 * size * uSize * l) / -mvp.z;
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform sampler2D uAlphaMap;

        #define PI 3.14159265359

        void main() {
          vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
          float a = texture2D(uAlphaMap, uv).g;
          if (a < 0.1) discard;

          gl_FragColor = vec4(vec3(1.0), a);
        }
      `,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const universe = new THREE.Points(universeGeometry, universeMaterial);
    scene.add(universe);

    // ------------------------ //
    // ANIMATION

    const startTime = Date.now();
    let animationComplete = false;

    const animate = () => {
      if (showRipple) return;

      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / 2, 1); // 5 second animation

      // Animate galaxy parameters using TWEEN-like easing
      const radius = THREE.MathUtils.lerp(0, 1.618, progress);
      const spin = THREE.MathUtils.lerp(0, Math.PI * 2, progress);
      const randomness = THREE.MathUtils.lerp(0, 0.5, progress);
      const rotate = THREE.MathUtils.lerp(0, Math.PI * 4, progress);

      galaxyMaterial.uniforms.uRadius.value = radius;
      galaxyMaterial.uniforms.uSpin.value = spin;
      galaxyMaterial.uniforms.uRandomness.value = randomness;
      galaxy.rotation.y = rotate;
      universe.rotation.y = rotate / 3;

      // Update time uniforms
      galaxyMaterial.uniforms.uTime.value += 0.001;
      universeMaterial.uniforms.uTime.value += 0.00067;

      renderer.render(scene, camera);

      if (progress >= 1 && !animationComplete) {
        animationComplete = true;
        // Start zoom-out effect
        startZoomOut();
      } else {
        requestAnimationFrame(animate);
      }
    };

    // Zoom-out effect function
    const startZoomOut = () => {
      const zoomStartTime = Date.now();
      const zoomDuration = 1500; // 2 seconds for zoom-out
      const startZ = camera.position.z;
      const endZ = 20; // Zoom out to z=20

      const zoomOut = () => {
        const zoomElapsed = (Date.now() - zoomStartTime) / 1000;
        const zoomProgress = Math.min(zoomElapsed / (zoomDuration / 1000), 1);

        // Smooth easing for zoom-out
        const easeOut = 1 - Math.pow(1 - zoomProgress, 3);
        const currentZ = THREE.MathUtils.lerp(startZ, endZ, easeOut);

        camera.position.z = currentZ;

        // Continue rotating during zoom-out
        galaxy.rotation.y += 0.02;
        universe.rotation.y += 0.01;

        // Update time uniforms
        galaxyMaterial.uniforms.uTime.value += 0.001;
        universeMaterial.uniforms.uTime.value += 0.00067;

        renderer.render(scene, camera);

        if (zoomProgress < 1) {
          requestAnimationFrame(zoomOut);
        } else {
          // Start fade-out effect
          setFadeOut(true);
          // Wait for fade-out animation to complete, then cleanup
          setTimeout(() => setShowRipple(true), 600);
        }
      };

      zoomOut();
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, [showRipple]);

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none bg-black"
      style={{ zIndex: 1 }}
    >
      {/* RippleBackground - always mounted, controlled by opacity */}
      <div
        className="absolute inset-0 w-full h-full transition-opacity duration-500"
        style={{
          opacity: fadeOut ? 1 : 0,
          zIndex: fadeOut ? 2 : 1,
        }}
      >
        <RippleBackground />
      </div>

      {/* BigBangBackground canvas - controlled by opacity */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full transition-opacity duration-500"
        style={{
          display: 'block',
          opacity: fadeOut ? 0 : 1,
          zIndex: fadeOut ? 1 : 2,
        }}
      />
    </div>
  );
}

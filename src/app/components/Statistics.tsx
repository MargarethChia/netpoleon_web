// components/Statistics.tsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";

type Dot = { lat: number; lon: number; label: string; value: string };
type Stat = { id: string; value: string; description: string; position: [number, number, number] };
type Arc = { from: [number, number]; to: [number, number] };

function latLonToCartesian(lat: number, lon: number, r: number) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

function Earth({ mapUrl = "/images/globe/earth_day.jpg" }: { mapUrl?: string }) {
  const tex = useTexture(mapUrl);
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((_, dt) => {
    mesh.current.rotation.y += dt * 0.05; // slower, more elegant rotation
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, 128, 128]} />
      <meshPhongMaterial 
        map={tex} 
        specular={new THREE.Color("#ff4400")} 
        shininess={15}
        emissive={new THREE.Color("#441100")}
        color={new THREE.Color("#ff6600")}
      />
    </mesh>
  );
}

function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[1.05, 64, 64]} />
      <shaderMaterial
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        vertexShader={`
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            gl_FragColor = vec4(1.0, 0.6, 0.2, 0.8) * intensity;
          }
        `}
      />
    </mesh>
  );
}

function FloatingStats({ stats }: { stats: Stat[] }) {
  const group = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      // Subtle floating animation
      child.position.y = stats[i].position[1] + Math.sin(t * 0.5 + i) * 0.05;
      // Gentle rotation for visual interest
      child.rotation.y = Math.sin(t * 0.3 + i) * 0.05;
    });
  });

  return (
    <group ref={group}>
      {stats.map((stat, i) => (
        <group key={stat.id} position={stat.position}>
          {/* Enhanced connection line to globe surface */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                args={[new Float32Array([0, 0, 0, 0, -0.8, 0]), 3]}
                attach="attributes-position"
                count={2}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#ff6600" opacity={0.8} transparent linewidth={2} />
          </line>
          
          {/* Glowing connection point on globe surface */}
          <mesh position={[0, -0.8, 0]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color="#ff6600" />
          </mesh>
          
          {/* Stat content with transparent background */}
          <Html position={[0, 0.1, 0]} center>
            <div className="text-center text-white font-bold">
              <div className="text-3xl text-orange-300 font-extrabold drop-shadow-lg">{stat.value}</div>
              <div className="text-sm text-orange-100 max-w-[220px] leading-tight font-medium drop-shadow-md">
                {stat.description}
              </div>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}

function CityDots({ dots, radius = 1.001 }: { dots: Dot[]; radius?: number }) {
  const positions = useMemo(() => {
    const arr: number[] = [];
    dots.forEach(({ lat, lon }) => {
      const p = latLonToCartesian(lat, lon, radius);
      arr.push(p.x, p.y, p.z);
    });
    return new Float32Array(arr);
  }, [dots, radius]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          array={positions}
          itemSize={3}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ff6600" size={0.015} sizeAttenuation />
    </points>
  );
}

function ArcLines({ arcs, radius = 1 }: { arcs: Arc[]; radius?: number }) {
  const group = useRef<THREE.Group>(null!);

  const lines = useMemo(() => {
    return arcs.map(({ from, to }) => {
      const p1 = latLonToCartesian(from[0], from[1], radius);
      const p2 = latLonToCartesian(to[0], to[1], radius);
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const lift = new THREE.Vector3(mid.x, mid.y, mid.z).normalize();
      const ctrl = new THREE.Vector3(...lift).multiplyScalar(radius * 1.3);
      const curve = new THREE.QuadraticBezierCurve3(p1, ctrl, p2);
      return new THREE.TubeGeometry(curve, 64, 0.002, 8, false);
    });
  }, [arcs, radius]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    group.current.children.forEach((m, i) => {
      const mat = (m as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 + 0.2 * Math.sin(t * 1.2 + i);
    });
  });

  return (
    <group ref={group}>
      {lines.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <meshBasicMaterial color="#ff6600" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export default function Statistics() {
  // Cloudflare-style statistics - positioned very close to globe for zoomed view
  const stats: Stat[] = [
    {
      id: "services",
      value: "60+",
      description: "cloud services available globally",
      position: [-1.2, 0.8, 0]
    },
    {
      id: "threats",
      value: "190B",
      description: "cyber threats blocked each day",
      position: [-0.4, 1.0, 0]
    },
    {
      id: "websites",
      value: "20%",
      description: "of all websites are protected",
      position: [0.4, 1.0, 0]
    },
    {
      id: "cities",
      value: "330+",
      description: "cities in 125+ countries",
      position: [1.2, 0.8, 0]
    }
  ];

  // Major cities with labels
  const dots: Dot[] = [
    { lat: 37.7749, lon: -122.4194, label: "San Francisco", value: "US West" },
    { lat: 51.5074, lon: -0.1278, label: "London", value: "Europe" },
    { lat: 1.3521, lon: 103.8198, label: "Singapore", value: "Asia" },
    { lat: -33.8688, lon: 151.2093, label: "Sydney", value: "Australia" },
    { lat: 40.7128, lon: -74.0060, label: "New York", value: "US East" },
    { lat: 35.6762, lon: 139.6503, label: "Tokyo", value: "Japan" }
  ];

  const arcs: Arc[] = [
    { from: [37.7749, -122.4194], to: [51.5074, -0.1278] },
    { from: [51.5074, -0.1278], to: [1.3521, 103.8198] },
    { from: [1.3521, 103.8198], to: [-33.8688, 151.2093] },
    { from: [40.7128, -74.0060], to: [35.6762, 139.6503] }
  ];

  return (
    <div className="relative w-full h-[600px] bg-white">
      <Canvas
        camera={{ position: [0, 1.2, 2.2], fov: 30 }}
        dpr={[1, 1.5]}
      >
        {/* Space backdrop */}
        <Stars radius={100} depth={50} count={3000} factor={4} fade />

        <ambientLight intensity={0.3} />
        <directionalLight position={[2, 2, 2]} intensity={1.5} color="#ff6600" />
        <pointLight position={[-2, -2, -2]} intensity={0.5} color="#ff6600" />
        
        {/* Main Globe Scene */}
        <group>
          <Earth />
          <Atmosphere />
          <CityDots dots={dots} />
          <ArcLines arcs={arcs} />
          
          {/* Subtle grid overlay for visual connection */}
          <mesh>
            <sphereGeometry args={[1.1, 32, 32]} />
            <meshBasicMaterial color="#ff6600" opacity={0.1} transparent wireframe />
          </mesh>
        </group>

        {/* Integrated Statistics */}
        {/* <FloatingStats stats={stats} />*/}
        
        {/* Additional ambient effects */}
        <fog attach="fog" args={['#000011', 3, 10]} />
      </Canvas>
      
    </div>
  );
}

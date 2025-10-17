'use client';
import { useEffect, useRef, useState } from 'react';
import { Color, Scene, Fog, PerspectiveCamera, Vector3, Group } from 'three';
import ThreeGlobe from 'three-globe';
import { useThree, Canvas, extend } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import countries from '@/data/globe.json';
declare module '@react-three/fiber' {
  interface ThreeElements {
    threeGlobe: ThreeElements['mesh'] & {
      new (): ThreeGlobe;
    };
  }
}

extend({ ThreeGlobe: ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 350;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  directionalRightLight?: string;
  directionalBottomLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

// numbersOfRings is used in the genRandomNumbers function

export function Globe({ globeConfig, data }: WorldProps) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const groupRef = useRef<Group | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const defaultProps = {
    pointSize: 4,
    atmosphereColor: '#ffffff',
    showAtmosphere: true,
    atmosphereAltitude: 0.2,
    polygonColor: '#ff6600', // Brighter orange continents
    globeColor: '#000000', // Black globe
    emissive: '#000000',
    emissiveIntensity: 0.1,
    shininess: 1.5,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };

  // Initialize globe only once
  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      globeRef.current = new ThreeGlobe();
      (groupRef.current as Group).add(globeRef.current);
      setIsInitialized(true);
    }
  }, []);

  // Build material when globe is initialized or when relevant props change
  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;

    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };
    globeMaterial.color = new Color(globeConfig.globeColor);
    globeMaterial.emissive = new Color(globeConfig.emissive);
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1;
    globeMaterial.shininess = globeConfig.shininess || 0.9;
  }, [
    isInitialized,
    globeConfig.globeColor,
    globeConfig.emissive,
    globeConfig.emissiveIntensity,
    globeConfig.shininess,
  ]);

  // Build data when globe is initialized or when data changes
  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return;

    const arcs = data;
    const points = [];
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      // rgb variable removed as it's not used
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: arc.color,
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: arc.color,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    }

    // No need to filter points - we'll only show branch points

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => {
        // Use the configured polygon color for all countries including Australia
        return defaultProps.polygonColor;
      });

    // Arcs removed - no arc animations

    // Add orange points for Australian cities with labels
    const branchPoints = [
      {
        lat: -33.8688,
        lng: 151.2093,
        size: defaultProps.pointSize,
        city: 'Sydney',
      }, // Australia, Sydney
      {
        lat: -37.8136,
        lng: 144.9631,
        size: defaultProps.pointSize,
        city: 'Melbourne',
      }, // Australia, Melbourne
      {
        lat: -27.4698,
        lng: 153.0251,
        size: defaultProps.pointSize,
        city: 'Brisbane',
      }, // Australia, Brisbane
    ];

    // Only show branch points
    globeRef.current
      .pointsData(branchPoints)
      .pointColor(() => '#ff6600')
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(1);

    // Note: ThreeGlobe doesn't have built-in hover methods
    // City labels would need to be implemented with custom tooltip system

    globeRef.current
      .ringsData([])
      .ringColor(() => defaultProps.polygonColor)
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod(
        (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings
      );
  }, [
    isInitialized,
    data,
    defaultProps.pointSize,
    defaultProps.showAtmosphere,
    defaultProps.atmosphereColor,
    defaultProps.atmosphereAltitude,
    defaultProps.polygonColor,
    defaultProps.arcLength,
    defaultProps.arcTime,
    defaultProps.rings,
    defaultProps.maxRings,
  ]);

  // Handle rings animation for branch points
  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;

    // Define branch points for ring animations - only Australia
    const branchPointsForRings = [
      { lat: -33.8688, lng: 151.2093 }, // Australia, Sydney
      { lat: -37.8136, lng: 144.9631 }, // Australia, Melbourne
      { lat: -27.4698, lng: 153.0251 }, // Australia, Brisbane
    ];

    const interval = setInterval(() => {
      if (!globeRef.current) return;

      // Show rings for all Australian cities (since we only have 3)
      const numRingsToShow = Math.min(3, branchPointsForRings.length); // Show all 3 Australian cities
      const selectedRings = branchPointsForRings.slice(0, numRingsToShow);

      const ringsData = selectedRings.map(point => ({
        lat: point.lat,
        lng: point.lng,
        color: '#ff6600', // Bright orange rings to match the points
      }));

      globeRef.current.ringsData(ringsData);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [isInitialized]);

  return <group ref={groupRef} />;
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffaaff, 0);
  }, [gl, size.width, size.height]);

  return null;
}

function CameraController({ globeConfig }: { globeConfig: GlobeConfig }) {
  const { camera } = useThree();

  useEffect(() => {
    if (globeConfig.initialPosition) {
      const { lat, lng } = globeConfig.initialPosition;
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const radius = cameraZ;

      // Position camera to look at the specified lat/lng
      camera.position.set(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );

      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }
  }, [globeConfig.initialPosition, camera]);

  return null;
}

export function World(props: WorldProps) {
  const { globeConfig } = props;
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);

  // Convert lat/lng to 3D coordinates for camera positioning
  // const convertLatLngToVector3 = (lat: number, lng: number, radius: number = 200) => {
  //   const phi = (90 - lat) * (Math.PI / 180);
  //   const theta = (lng + 180) * (Math.PI / 180);
  //
  //   return new Vector3(
  //     -(radius * Math.sin(phi) * Math.cos(theta)),
  //     radius * Math.cos(phi),
  //     radius * Math.sin(phi) * Math.sin(theta)
  //   );
  // };
  return (
    <Canvas scene={scene} camera={new PerspectiveCamera(50, aspect, 180, 1800)}>
      <WebGLRendererConfig />
      <CameraController globeConfig={globeConfig} />
      <ambientLight color={globeConfig.ambientLight} intensity={1.0} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={new Vector3(-500, 0, 0)}
        intensity={0.5}
      />
      <directionalLight
        color={globeConfig.directionalRightLight || '#ffffff'}
        position={new Vector3(500, 0, 0)}
        intensity={0.5}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={new Vector3(0, 500, 0)}
        intensity={0.5}
      />
      <directionalLight
        color={globeConfig.directionalBottomLight || '#ffffff'}
        position={new Vector3(0, -500, 0)}
        intensity={0.5}
      />
      <directionalLight
        color="#ffffff"
        position={new Vector3(0, 0, 500)}
        intensity={0.5}
      />
      <directionalLight
        color="#ffffff"
        position={new Vector3(0, 0, -500)}
        intensity={0.5}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={new Vector3(0, 0, 0)}
        intensity={0.3}
      />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={0}
        autoRotate={false}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

export function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
}

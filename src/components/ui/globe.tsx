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
const cameraZ = 300;

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
    pointSize: 2,
    atmosphereColor: '#ffffff',
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: '#ffffff', // Changed to orange to match globe
    globeColor: '#ffffff',
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
      .hexPolygonColor((d: unknown) => {
        // Check if this is Australia and make it brighter
        const country = d as { properties?: { name?: string } };
        if (country.properties?.name === 'Australia') {
          return 'rgba(255, 255, 255, 1.0)'; // Full white for Australia
        }
        return defaultProps.polygonColor;
      });

    globeRef.current
      .arcsData(data)
      .arcStartLat(d => (d as { startLat: number }).startLat * 1)
      .arcStartLng(d => (d as { startLng: number }).startLng * 1)
      .arcEndLat(d => (d as { endLat: number }).endLat * 1)
      .arcEndLng(d => (d as { endLng: number }).endLng * 1)
      .arcColor(() => '#f97316')
      .arcAltitude(e => (e as { arcAlt: number }).arcAlt * 1)
      .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap(e => (e as { order: number }).order * 1)
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime);

    // Add white points at specific branch locations
    const branchPoints = [
      { lat: -33.8688, lng: 151.2093, size: defaultProps.pointSize }, // Australia, Sydney
      { lat: 12.5657, lng: 104.991, size: defaultProps.pointSize }, // Cambodia
      { lat: 20.5937, lng: 78.9629, size: defaultProps.pointSize }, // India
      { lat: -0.7893, lng: 113.9213, size: defaultProps.pointSize }, // Indonesia
      { lat: 4.2105, lng: 101.9758, size: defaultProps.pointSize }, // Malaysia
      { lat: 21.9162, lng: 95.956, size: defaultProps.pointSize }, // Myanmar
      { lat: -40.9006, lng: 174.886, size: defaultProps.pointSize }, // New Zealand
      { lat: 12.8797, lng: 121.774, size: defaultProps.pointSize }, // Philippines
      { lat: 15.87, lng: 100.9925, size: defaultProps.pointSize }, // Thailand
      { lat: 14.0583, lng: 108.2772, size: defaultProps.pointSize }, // Vietnam
    ];

    // Only show branch points
    globeRef.current
      .pointsData(branchPoints)
      .pointColor(() => '#ffffff')
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2);

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

    // Define branch points for ring animations
    const branchPointsForRings = [
      { lat: -33.8688, lng: 151.2093 }, // Australia, Sydney
      { lat: 12.5657, lng: 104.991 }, // Cambodia
      { lat: 20.5937, lng: 78.9629 }, // India
      { lat: -0.7893, lng: 113.9213 }, // Indonesia
      { lat: 4.2105, lng: 101.9758 }, // Malaysia
      { lat: 21.9162, lng: 95.956 }, // Myanmar
      { lat: -40.9006, lng: 174.886 }, // New Zealand
      { lat: 12.8797, lng: 121.774 }, // Philippines
      { lat: 15.87, lng: 100.9925 }, // Thailand
      { lat: 14.0583, lng: 108.2772 }, // Vietnam
    ];

    const interval = setInterval(() => {
      if (!globeRef.current) return;

      // Randomly select 6-8 branch points to animate rings at a time
      const numRingsToShow = Math.floor(Math.random() * 3) + 6; // 6-8 rings
      const shuffled = [...branchPointsForRings].sort(
        () => 0.5 - Math.random()
      );
      const selectedRings = shuffled.slice(0, numRingsToShow);

      const ringsData = selectedRings.map(point => ({
        lat: point.lat,
        lng: point.lng,
        color: '#ffffff', // White rings to match the points
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

export function World(props: WorldProps) {
  const { globeConfig } = props;
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);
  return (
    <Canvas scene={scene} camera={new PerspectiveCamera(50, aspect, 180, 1800)}>
      <WebGLRendererConfig />
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
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={1}
        autoRotate={true}
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

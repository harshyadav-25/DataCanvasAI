import { Canvas, useFrame } from '@react-three/fiber'

import {
  Float,
  RoundedBox,
  Text,
  Sparkles,
  Environment,
} from '@react-three/drei'

import { useEffect, useMemo, useRef } from 'react'

import * as THREE from 'three'

import './DataPipeline3D.css'

/* =========================================================
   CONNECTION LINE
========================================================= */

function Connection({
  start,
  end,
  color = '#3978FF',
  opacity = 0.65,
}) {
  const direction = useMemo(() => {
    return new THREE.Vector3(
      end[0] - start[0],
      end[1] - start[1],
      end[2] - start[2]
    )
  }, [start, end])

  const length = direction.length()

  const midpoint = useMemo(
    () => [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2,
    ],
    [start, end]
  )

  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion()

    q.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.clone().normalize()
    )

    return q
  }, [direction])

  return (
    <mesh
      position={midpoint}
      quaternion={quaternion}
    >
      <cylinderGeometry
        args={[0.012, 0.012, length, 8]}
      />

      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
      />
    </mesh>
  )
}

/* =========================================================
   DATA CARD
========================================================= */

function DataCard({
  position,
  label,
  color,
  rotation = [0, 0, 0],
  scale = 1,
}) {
  return (
    <Float
      speed={1.2}
      rotationIntensity={0.35}
      floatIntensity={0.5}
    >
      <group
        position={position}
        rotation={rotation}
        scale={scale}
      >
        {/* Outer Glow */}

        <RoundedBox
          args={[1.7, 0.95, 0.12]}
          radius={0.13}
          smoothness={6}
        >
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.10}
          />
        </RoundedBox>

        {/* Main Glass Card */}

        <mesh position={[0, 0, 0.06]}>
          <RoundedBox
            args={[1.48, 0.76, 0.14]}
            radius={0.11}
            smoothness={6}
          >
            <meshPhysicalMaterial
              color="#0D1429"
              metalness={0.7}
              roughness={0.15}
              clearcoat={1}
              clearcoatRoughness={0.08}
            />
          </RoundedBox>
        </mesh>

        {/* Icon */}

        <mesh position={[-0.48, 0, 0.17]}>
          <boxGeometry
            args={[0.23, 0.23, 0.05]}
          />

          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={3}
            metalness={0.5}
            roughness={0.15}
          />
        </mesh>

        {/* Text */}

        <Text
          position={[0.12, 0.02, 0.18]}
          fontSize={0.22}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>

        {/* Bottom Glow Line */}

        <mesh position={[0, -0.29, 0.18]}>
          <boxGeometry
            args={[0.85, 0.025, 0.02]}
          />

          <meshBasicMaterial
            color={color}
          />
        </mesh>
      </group>
    </Float>
  )
}

/* =========================================================
   DATA PLATFORM
========================================================= */

function DataPlatform({
  position,
  scale = 1,
}) {
  return (
    <group
      position={position}
      scale={scale}
    >
      <RoundedBox
        args={[3.6, 0.22, 2]}
        radius={0.16}
        smoothness={7}
      >
        <meshPhysicalMaterial
          color="#091126"
          metalness={0.8}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </RoundedBox>

      {/* Surface */}

      <mesh position={[0, 0.13, 0]}>
        <boxGeometry
          args={[3.3, 0.025, 1.7]}
        />

        <meshBasicMaterial
          color="#2563EB"
          transparent
          opacity={0.20}
        />
      </mesh>

      {/* Front Glow */}

      <mesh position={[0, 0.16, 0.88]}>
        <boxGeometry
          args={[2.9, 0.025, 0.025]}
        />

        <meshBasicMaterial
          color="#3978FF"
        />
      </mesh>

      {/* Side Glow */}

      <mesh position={[1.48, 0.16, 0]}>
        <boxGeometry
          args={[0.025, 0.025, 1.5]}
        />

        <meshBasicMaterial
          color="#8B5CF6"
        />
      </mesh>
    </group>
  )
}

/* =========================================================
   AI CORE
========================================================= */

function AICore() {
  const group = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (!group.current) return

    group.current.rotation.y = t * 0.5

    group.current.rotation.x =
      Math.sin(t * 0.7) * 0.15
  })

  return (
    <group ref={group}>
      {/* Outer Ring */}

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry
          args={[1.05, 0.025, 16, 100]}
        />

        <meshBasicMaterial
          color="#3978FF"
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* Second Ring */}

      <mesh rotation={[0.7, 0.3, 0.2]}>
        <torusGeometry
          args={[0.78, 0.02, 16, 100]}
        />

        <meshBasicMaterial
          color="#8B5CF6"
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* Third Ring */}

      <mesh rotation={[1.1, 0.8, 0.4]}>
        <torusGeometry
          args={[0.55, 0.017, 16, 100]}
        />

        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Core */}

      <mesh>
        <icosahedronGeometry
          args={[0.46, 3]}
        />

        <meshPhysicalMaterial
          color="#635BFF"
          emissive="#5148D8"
          emissiveIntensity={4}
          metalness={0.45}
          roughness={0.10}
          clearcoat={1}
        />
      </mesh>

      {/* Core Light */}

      <mesh>
        <sphereGeometry
          args={[0.18, 32, 32]}
        />

        <meshBasicMaterial
          color="#E8E7FF"
        />
      </mesh>
    </group>
  )
}

/* =========================================================
   ML READY CORE
========================================================= */

function MLReady() {
  const ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (!ref.current) return

    ref.current.rotation.y = t * 0.4
    ref.current.rotation.z = t * 0.25
  })

  return (
    <Float
      speed={1.5}
      floatIntensity={0.65}
      rotationIntensity={0.25}
    >
      <group
        ref={ref}
        position={[0, 0, 0]}
      >
        {/* Outer Shell */}

        <mesh scale={1.35}>
          <icosahedronGeometry
            args={[0.58, 2]}
          />

          <meshBasicMaterial
            color="#3B82F6"
            transparent
            opacity={0.10}
          />
        </mesh>

        {/* Main Object */}

        <mesh>
          <icosahedronGeometry
            args={[0.48, 2]}
          />

          <meshPhysicalMaterial
            color="#2563EB"
            emissive="#2563EB"
            emissiveIntensity={3}
            metalness={0.7}
            roughness={0.1}
            clearcoat={1}
          />
        </mesh>

        {/* Center */}

        <mesh>
          <sphereGeometry
            args={[0.14, 24, 24]}
          />

          <meshBasicMaterial
            color="#C4E8FF"
          />
        </mesh>
      </group>
    </Float>
  )
}

/* =========================================================
   FLOATING CUBES
========================================================= */

function FloatingCubes() {
  const cubes = [
    [-9, 3.8, -1.5, '#3478FF', 0.24],
    [-7.2, 5.1, 0.4, '#865CFF', 0.18],
    [-5.4, 4.4, -1, '#38BDF8', 0.20],
    [-3.2, 5.2, -0.5, '#6366F1', 0.22],

    [3.2, 5.0, -1, '#7C5CFF', 0.20],
    [5.4, 4.4, 0.2, '#3283FF', 0.23],
    [7.2, 5.2, -1.2, '#38BDF8', 0.18],
    [9, 3.7, 0.5, '#8B5CF6', 0.24],

    [-8.8, -1.8, -0.5, '#2563EB', 0.20],
    [-7, -3, 0.3, '#8B5CF6', 0.17],
    [-5, -2.4, -1, '#38BDF8', 0.22],

    [5, -2.5, -0.8, '#6366F1', 0.18],
    [7, -3.2, 0.4, '#3478FF', 0.22],
    [8.8, -1.5, -0.7, '#8B5CF6', 0.20],
  ]

  return (
    <group>
      {cubes.map((item, index) => (
        <Float
          key={index}
          speed={1 + index * 0.05}
          floatIntensity={0.65}
          rotationIntensity={0.8}
        >
          <mesh
            position={item.slice(0, 3)}
          >
            <boxGeometry
              args={[
                item[4],
                item[4],
                item[4],
              ]}
            />

            <meshStandardMaterial
              color={item[3]}
              emissive={item[3]}
              emissiveIntensity={3}
              metalness={0.65}
              roughness={0.12}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

/* =========================================================
   LARGE ORBIT RINGS
========================================================= */

function OrbitRing({
  position,
  scale = 1,
  color = '#3978FF',
  rotation = [0, 0, 0],
}) {
  const ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (!ref.current) return

    ref.current.rotation.z =
      rotation[2] + t * 0.08

    ref.current.rotation.y =
      rotation[1] + t * 0.05
  })

  return (
    <mesh
      ref={ref}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <torusGeometry
        args={[2, 0.012, 12, 100]}
      />

      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.30}
      />
    </mesh>
  )
}

/* =========================================================
   PARTICLES
========================================================= */

function DataParticles() {
  const group = useRef()

  const particles = useMemo(() => {
    return Array.from(
      { length: 220 },
      (_, index) => {
        const side =
          Math.random() > 0.5
            ? 1
            : -1

        return {
          position: [
            -9 + Math.random() * 18,
            -4 + Math.random() * 9,
            -3 + Math.random() * 6,
          ],

          speed:
            0.15 + Math.random() * 0.45,

          size:
            0.012 + Math.random() * 0.035,

          color:
            index % 3 === 0
              ? '#8B5CF6'
              : index % 2 === 0
                ? '#38BDF8'
                : '#3978FF',

          direction: side,
        }
      }
    )
  }, [])

  useFrame((state) => {
    const t =
      state.clock.getElapsedTime()

    if (!group.current) return

    group.current.children.forEach(
      (particle, index) => {
        const p = particles[index]

        particle.position.x +=
          p.speed *
          p.direction *
          0.003

        particle.position.y +=
          Math.sin(
            t * p.speed + index
          ) * 0.0008

        if (particle.position.x > 9) {
          particle.position.x = -9
        }

        if (particle.position.x < -9) {
          particle.position.x = 9
        }
      }
    )
  })

  return (
    <group ref={group}>
      {particles.map(
        (particle, index) => (
          <mesh
            key={index}
            position={particle.position}
          >
            <sphereGeometry
              args={[
                particle.size,
                8,
                8,
              ]}
            />

            <meshBasicMaterial
              color={particle.color}
              transparent
              opacity={0.75}
            />
          </mesh>
        )
      )}
    </group>
  )
}

/* =========================================================
   FLOW PULSE
========================================================= */

function FlowPulse({
  start,
  end,
  color,
  delay = 0,
}) {
  const ref = useRef()

  useFrame((state) => {
    const t =
      state.clock.getElapsedTime()

    const progress =
      ((t * 0.25 + delay) % 1)

    if (!ref.current) return

    ref.current.position.x =
      THREE.MathUtils.lerp(
        start[0],
        end[0],
        progress
      )

    ref.current.position.y =
      THREE.MathUtils.lerp(
        start[1],
        end[1],
        progress
      )

    ref.current.position.z =
      THREE.MathUtils.lerp(
        start[2],
        end[2],
        progress
      )
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry
        args={[0.075, 16, 16]}
      />

      <meshBasicMaterial
        color={color}
      />
    </mesh>
  )
}

/* =========================================================
   DATA STREAM
========================================================= */

function DataStream({
  start,
  end,
  color,
}) {
  return (
    <>
      <Connection
        start={start}
        end={end}
        color={color}
        opacity={0.35}
      />

      <FlowPulse
        start={start}
        end={end}
        color={color}
      />

      <FlowPulse
        start={start}
        end={end}
        color="#FFFFFF"
        delay={0.5}
      />
    </>
  )
}

/* =========================================================
   SIDE DATA NETWORK
========================================================= */

function SideNetwork() {
  const leftNodes = [
    [-9, 2.8, -1],
    [-8.1, 1.2, 0],
    [-8.8, -0.5, -0.5],
    [-7.4, -2.2, 0.5],
  ]

  const rightNodes = [
    [9, 2.8, -0.5],
    [8.1, 1.2, 0],
    [8.8, -0.5, -1],
    [7.4, -2.2, 0.3],
  ]

  return (
    <group>

      {/* LEFT NETWORK */}

      {leftNodes.map(
        (position, index) => (
          <Float
            key={`left-${index}`}
            speed={1.2 + index * 0.1}
            floatIntensity={0.5}
          >
            <mesh position={position}>
              <sphereGeometry
                args={[0.07, 16, 16]}
              />

              <meshBasicMaterial
                color={
                  index % 2 === 0
                    ? '#3978FF'
                    : '#8B5CF6'
                }
              />
            </mesh>
          </Float>
        )
      )}

      <DataStream
        start={leftNodes[0]}
        end={[-3.2, 1.3, 0]}
        color="#3978FF"
      />

      <DataStream
        start={leftNodes[1]}
        end={[-3, 0.5, 0]}
        color="#8B5CF6"
      />

      <DataStream
        start={leftNodes[2]}
        end={[-3.1, -0.4, 0]}
        color="#38BDF8"
      />

      <DataStream
        start={leftNodes[3]}
        end={[-2.8, -1.1, 0]}
        color="#3978FF"
      />

      {/* RIGHT NETWORK */}

      {rightNodes.map(
        (position, index) => (
          <Float
            key={`right-${index}`}
            speed={1.2 + index * 0.1}
            floatIntensity={0.5}
          >
            <mesh position={position}>
              <sphereGeometry
                args={[0.07, 16, 16]}
              />

              <meshBasicMaterial
                color={
                  index % 2 === 0
                    ? '#8B5CF6'
                    : '#38BDF8'
                }
              />
            </mesh>
          </Float>
        )
      )}

      <DataStream
        start={[3.1, 1.2, 0]}
        end={rightNodes[0]}
        color="#8B5CF6"
      />

      <DataStream
        start={[3, 0.5, 0]}
        end={rightNodes[1]}
        color="#3978FF"
      />

      <DataStream
        start={[3.1, -0.3, 0]}
        end={rightNodes[2]}
        color="#38BDF8"
      />

      <DataStream
        start={[2.8, -1.1, 0]}
        end={rightNodes[3]}
        color="#8B5CF6"
      />
    </group>
  )
}

/* =========================================================
   MAIN SCENE
========================================================= */

function Scene() {
  const sceneGroup = useRef()

  /*
    Global mouse position.
    Isse Canvas ke pointer-events par dependency nahi rahegi.
  */

  const mouse = useRef({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current.x =
        (event.clientX /
          window.innerWidth) *
          2 -
        1

      mouse.current.y =
        -(event.clientY /
          window.innerHeight) *
          2 +
        1
    }

    window.addEventListener(
      'mousemove',
      handleMouseMove
    )

    return () => {
      window.removeEventListener(
        'mousemove',
        handleMouseMove
      )
    }
  }, [])

  useFrame((state) => {
    if (!sceneGroup.current) return

    const targetX =
      mouse.current.y * -0.10

    const targetY =
      mouse.current.x * 0.15

    /* Smooth Mouse Rotation */

    sceneGroup.current.rotation.x =
      THREE.MathUtils.lerp(
        sceneGroup.current.rotation.x,
        targetX,
        0.035
      )

    sceneGroup.current.rotation.y =
      THREE.MathUtils.lerp(
        sceneGroup.current.rotation.y,
        targetY,
        0.035
      )

    /* Slight Floating */

    const t =
      state.clock.getElapsedTime()

    sceneGroup.current.position.y =
      Math.sin(t * 0.35) * 0.06
  })

  return (
    <>
      <group
        ref={sceneGroup}
        position={[0, 0, 0]}
      >

        {/* =================================================
            TOP FLOATING NETWORK
        ================================================= */}

        <FloatingCubes />

        <OrbitRing
          position={[-6.2, 3.5, -2]}
          scale={0.8}
          color="#3978FF"
          rotation={[1.1, 0.2, 0.4]}
        />

        <OrbitRing
          position={[6.2, 3.5, -2]}
          scale={0.75}
          color="#8B5CF6"
          rotation={[0.8, 0.4, 1]}
        />

        {/* =================================================
            LEFT RAW DATA
        ================================================= */}

        <DataPlatform
          position={[-5.4, 0, 0]}
          scale={0.85}
        />

        <Text
          position={[-5.4, 0.38, 0]}
          fontSize={0.18}
          color="#6F7EA5"
        >
          RAW DATA
        </Text>

        <DataCard
          label="CSV"
          color="#3978FF"
          position={[-7.3, 1.25, -0.5]}
          rotation={[0, 0.15, -0.08]}
          scale={0.9}
        />

        <DataCard
          label="XLS"
          color="#22C55E"
          position={[-5.4, 1.8, 0.3]}
          rotation={[0, -0.1, 0.05]}
          scale={0.85}
        />

        <DataCard
          label="JSON"
          color="#8B5CF6"
          position={[-3.7, 1.1, -0.3]}
          rotation={[0, 0.12, 0.06]}
          scale={0.8}
        />

        <DataCard
          label="SQL"
          color="#F59E0B"
          position={[-6.6, -1.4, -0.4]}
          rotation={[0.05, -0.1, -0.04]}
          scale={0.85}
        />

        {/* =================================================
            CENTER AI
        ================================================= */}

        <DataPlatform
          position={[0, 0.3, 0]}
          scale={1.0}
        />

        <Text
          position={[0, 0.68, 0]}
          fontSize={0.20}
          color="#8177FF"
        >
          AI PROCESSING
        </Text>

        <group
          position={[0, 1.7, 0]}
          scale={1.15}
        >
          <AICore />
        </group>

        {/* =================================================
            RIGHT ML READY
        ================================================= */}

        <DataPlatform
          position={[5.4, 0.7, 0]}
          scale={0.85}
        />

        <Text
          position={[5.4, 1.08, 0]}
          fontSize={0.18}
          color="#58A6FF"
        >
          ML READY
        </Text>

        <group
          position={[5.4, 2.05, 0]}
          scale={1.1}
        >
          <MLReady />
        </group>

        <Text
          position={[5.4, 0.22, 0.5]}
          fontSize={0.14}
          color="#6FCFFF"
        >
          DATASET READY
        </Text>

        {/* =================================================
            MAIN DATA FLOW
        ================================================= */}

        <DataStream
          start={[-3.5, 0.3, 0]}
          end={[-1.0, 1.25, 0]}
          color="#3978FF"
        />

        <DataStream
          start={[-1.0, 1.25, 0]}
          end={[1.0, 1.25, 0]}
          color="#8B5CF6"
        />

        <DataStream
          start={[1.0, 1.25, 0]}
          end={[3.5, 1.55, 0]}
          color="#38BDF8"
        />

        {/* =================================================
            SIDE NETWORKS
        ================================================= */}

        <SideNetwork />

        {/* =================================================
            BOTTOM ORBITS
        ================================================= */}

        <OrbitRing
          position={[-6.2, -2.5, -1.5]}
          scale={0.65}
          color="#8B5CF6"
          rotation={[0.8, 0.2, 0]}
        />

        <OrbitRing
          position={[6.2, -2.5, -1.5]}
          scale={0.7}
          color="#3978FF"
          rotation={[1.2, 0.3, 0.4]}
        />

        <OrbitRing
          position={[0, -3.1, -2]}
          scale={1.3}
          color="#3158FF"
          rotation={[Math.PI / 2, 0, 0]}
        />

        {/* =================================================
            PARTICLES
        ================================================= */}

        <DataParticles />

      </group>

      {/* =================================================
          GLOBAL SPARKLES
      ================================================= */}

      <Sparkles
        count={260}
        scale={[20, 11, 8]}
        size={1.7}
        speed={0.25}
        opacity={0.55}
      />

      <Sparkles
        count={100}
        scale={[14, 7, 5]}
        size={2.4}
        speed={0.18}
        opacity={0.35}
      />
    </>
  )
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function DataPipeline3D() {
  return (
    <div className="data-pipeline-3d">

      <Canvas
        dpr={[1, 1.6]}

        /* Slight Zoom In */

        camera={{
          position: [0, 1.2, 10.5],
          fov: 45,
        }}

        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >

        {/* Ambient */}

        <ambientLight
          intensity={0.25}
        />

        {/* Left Blue */}

        <pointLight
          position={[-7, 3, 4]}
          color="#2563EB"
          intensity={35}
          distance={14}
        />

        {/* Right Purple */}

        <pointLight
          position={[7, 3, 4]}
          color="#7C3AED"
          intensity={30}
          distance={14}
        />

        {/* Center Cyan */}

        <pointLight
          position={[0, 2, 5]}
          color="#38BDF8"
          intensity={16}
          distance={11}
        />

        {/* Bottom Blue */}

        <pointLight
          position={[0, -4, 2]}
          color="#3158FF"
          intensity={15}
          distance={10}
        />

        <directionalLight
          position={[0, 8, 5]}
          intensity={1.2}
        />

        <Environment
          preset="night"
        />

        <Scene />

      </Canvas>
    </div>
  )
}
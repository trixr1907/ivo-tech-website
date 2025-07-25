'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useCallback } from 'react';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';

export default function Scene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Mausposition für Interaktivität
  const mousePosition = useRef({ x: 0, y: 0 });

  // Animation State
  const animationState = useRef({
    pulseIntensity: 0,
    rotationSpeed: 1,
    particleSpeed: 1,
  });

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mousePosition.current = {
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
      };
    }
  }, []);

  const handleClick = useCallback(() => {
    setIsClicked(prev => !prev);
    animationState.current.rotationSpeed = isClicked ? 1 : 2;
    animationState.current.particleSpeed = isClicked ? 1 : 1.5;
  }, [isClicked]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    containerRef.current.appendChild(renderer.domElement);

    // Post-processing setup
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // Stärke
      0.4, // Radius
      0.85 // Threshold
    );
    composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    // Füge Nebel für Tiefeneffekt hinzu
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.05);

    // Create particle system
    const particleCount = 2000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Add center sphere
    const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x4444ff,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.8,
      transmission: 0.5,
      emissive: 0x4444ff,
      emissiveIntensity: 0.5,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // Add energy rings
    const ringGeometry = new THREE.TorusGeometry(1.5, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00ffff,
      metalness: 1,
      roughness: 0,
      transparent: true,
      opacity: 0.6,
      emissive: 0x00ffff,
      emissiveIntensity: 1,
    });

    const rings: THREE.Mesh[] = [];
    const ringCount = 3;

    for (let i = 0; i < ringCount; i++) {
      const ring = new THREE.Mesh(ringGeometry, ringMaterial.clone());
      ring.rotation.x = Math.PI / 2;
      ring.rotation.y = (i * Math.PI) / ringCount;
      rings.push(ring);
      scene.add(ring);
    }

    // Add orbiting objects
    const orbitingObjects: THREE.Mesh[] = [];
    const orbitCount = 5;

    for (let i = 0; i < orbitCount; i++) {
      const size = 0.3;
      const orbitGeometry = new THREE.IcosahedronGeometry(size);
      const orbitMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(i / orbitCount, 0.8, 0.5),
        metalness: 0.7,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9,
      });
      const orbitObject = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbitingObjects.push(orbitObject);
      scene.add(orbitObject);
    }

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x4444ff, 4, 10);
    const pointLight2 = new THREE.PointLight(0xff4444, 4, 10);
    const pointLight3 = new THREE.PointLight(0x00ffff, 4, 10);

    pointLight1.position.set(2, 2, 2);
    pointLight2.position.set(-2, -2, -2);
    pointLight3.position.set(0, 3, 0);

    scene.add(pointLight1);
    scene.add(pointLight2);
    scene.add(pointLight3);

    // Add volumetric light cone
    const coneGeometry = new THREE.ConeGeometry(0.2, 4, 32);
    const coneMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
    });

    const lightCone = new THREE.Mesh(coneGeometry, coneMaterial);
    lightCone.position.y = 1;
    lightCone.rotation.x = Math.PI;
    scene.add(lightCone);

    // Position camera
    camera.position.z = 8;
    camera.position.y = 2;
    camera.lookAt(0, 0, 0);

    // Animation
    let frame = 0;
    function animate() {
      frame = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Pulse animation
      animationState.current.pulseIntensity = (Math.sin(time * 2) + 1) * 0.5;

      // Rotate particle system
      particleSystem.rotation.y +=
        0.0005 * animationState.current.particleSpeed;

      // Animate sphere
      sphere.rotation.y += 0.01 * animationState.current.rotationSpeed;
      sphere.rotation.x += 0.005 * animationState.current.rotationSpeed;

      // Update sphere material
      const sphereMat = sphere.material as THREE.MeshPhysicalMaterial;
      sphereMat.emissiveIntensity =
        0.5 + animationState.current.pulseIntensity * 0.5;

      // Animate rings
      rings.forEach((ring, i) => {
        ring.rotation.z =
          time * (0.5 + i * 0.1) * animationState.current.rotationSpeed;
        ring.scale.setScalar(1 + animationState.current.pulseIntensity * 0.1);
      });

      // Animate orbiting objects
      orbitingObjects.forEach((obj, index) => {
        const angle =
          (time + index * ((Math.PI * 2) / orbitCount)) % (Math.PI * 2);
        const radius = 2.5;
        obj.position.x = Math.cos(angle) * radius;
        obj.position.z = Math.sin(angle) * radius;
        obj.rotation.y += 0.02 * animationState.current.rotationSpeed;
        obj.rotation.x += 0.01 * animationState.current.rotationSpeed;

        // Update material
        const mat = obj.material as THREE.MeshPhysicalMaterial;
        mat.emissiveIntensity =
          0.5 + animationState.current.pulseIntensity * 0.5;
      });

      // Camera movement based on mouse position
      const targetX = mousePosition.current.x * 2;
      const targetY = mousePosition.current.y * 2;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Render with post-processing
      composer.render();
    }

    // Handle window resize
    function handleResize() {
      const width = containerRef.current?.clientWidth || window.innerWidth;
      const height = containerRef.current?.clientHeight || window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
    }

    window.addEventListener('resize', handleResize);
    containerRef.current?.addEventListener('mousemove', handleMouseMove);
    containerRef.current?.addEventListener('click', handleClick);
    containerRef.current?.addEventListener('mouseenter', handleMouseEnter);
    containerRef.current?.addEventListener('mouseleave', handleMouseLeave);

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      containerRef.current?.removeEventListener('click', handleClick);
      containerRef.current?.removeEventListener('mouseenter', handleMouseEnter);
      containerRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      containerRef.current?.removeChild(renderer.domElement);
      cancelAnimationFrame(frame);
      renderer.dispose();
      composer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100vh',
        cursor: isHovered ? 'pointer' : 'default',
      }}
    />
  );
}

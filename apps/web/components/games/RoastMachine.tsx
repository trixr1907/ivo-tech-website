'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { useKonamiCode } from './hooks/useKonamiCode';
import { RoastEngine } from './utils/RoastEngine';
import {
  ArcadeVertexShader,
  ArcadeFragmentShader,
  CRTVertexShader,
  CRTFragmentShader,
} from './shaders/ArcadeShader';

interface RoastMachineProps {
  onRoastGenerated?: (roast: string) => void;
}

function RoastMachine({ onRoastGenerated }: RoastMachineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentRoast, setCurrentRoast] = useState('');

  const { isKonamiCodeActive, resetKonamiCode, progress } = useKonamiCode();

  const roastEngine = useMemo(() => RoastEngine.getInstance(), []);

  // Animation state
  const animationState = useRef({
    cabinet: {
      rotation: new THREE.Vector3(0, 0, 0),
      position: new THREE.Vector3(0, 0, 0),
    },
    screen: {
      brightness: 0,
      scanlineIntensity: 0,
    },
    time: 0,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

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

    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    containerRef.current.appendChild(renderer.domElement);

    // Post-processing setup
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    composer.addPass(bloomPass);

    // Custom shader passes
    const arcadePass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        time: { value: 0 },
        glowIntensity: { value: 0 },
        scanlineIntensity: { value: 0 },
      },
      vertexShader: ArcadeVertexShader,
      fragmentShader: ArcadeFragmentShader,
    });
    composer.addPass(arcadePass);

    const crtPass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        time: { value: 0 },
      },
      vertexShader: CRTVertexShader,
      fragmentShader: CRTFragmentShader,
    });
    composer.addPass(crtPass);

    // Arcade cabinet geometry
    const cabinetGeometry = new THREE.BoxGeometry(2, 3, 1);
    const cabinetMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x2222ff,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x0000ff,
      emissiveIntensity: 0.2,
    });
    const cabinet = new THREE.Mesh(cabinetGeometry, cabinetMaterial);
    scene.add(cabinet);

    // Screen
    const screenGeometry = new THREE.PlaneGeometry(1.5, 1.5);
    const screenMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        brightness: { value: 0 },
        scanlineIntensity: { value: 0 },
      },
      vertexShader: ArcadeVertexShader,
      fragmentShader: ArcadeFragmentShader,
      transparent: true,
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.51;
    cabinet.add(screen);

    // Controls
    const controlsGeometry = new THREE.BoxGeometry(1.5, 0.5, 0.3);
    const controlsMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff0000,
      metalness: 0.5,
      roughness: 0.5,
    });
    const controls = new THREE.Mesh(controlsGeometry, controlsMaterial);
    controls.position.y = -1;
    controls.position.z = 0.5;
    cabinet.add(controls);

    // Joystick
    const joystickBaseGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
    const joystickTopGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const joystickMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffff00,
      metalness: 0.8,
      roughness: 0.2,
    });

    const joystickBase = new THREE.Mesh(joystickBaseGeometry, joystickMaterial);
    const joystickTop = new THREE.Mesh(joystickTopGeometry, joystickMaterial);

    joystickBase.position.set(-0.4, -1, 0.7);
    joystickTop.position.set(-0.4, -0.8, 0.7);

    cabinet.add(joystickBase);
    cabinet.add(joystickTop);

    // Buttons
    const buttonGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 16);
    const buttonMaterials = [
      new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        metalness: 0.8,
        roughness: 0.2,
      }),
      new THREE.MeshPhysicalMaterial({
        color: 0x00ff00,
        metalness: 0.8,
        roughness: 0.2,
      }),
      new THREE.MeshPhysicalMaterial({
        color: 0x0000ff,
        metalness: 0.8,
        roughness: 0.2,
      }),
    ];

    const buttons: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const button = new THREE.Mesh(buttonGeometry, buttonMaterials[i]);
      button.position.set(0.2 + i * 0.3, -1, 0.7);
      buttons.push(button);
      cabinet.add(button);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(5, 5, 5);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.1;
    spotLight.decay = 2;
    spotLight.distance = 200;
    scene.add(spotLight);

    // Neon trim lights
    const trimGeometry = new THREE.TorusGeometry(0.05, 0.02, 16, 100);
    const trimMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 1,
      metalness: 1,
      roughness: 0,
    });

    const trimLights: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const trim = new THREE.Mesh(trimGeometry, trimMaterial);
      trim.position.z = 0.52;
      trim.scale.set(0.8, 0.8, 1);
      switch (i) {
        case 0:
          trim.position.set(0.75, 0.75, 0.52);
          break;
        case 1:
          trim.position.set(-0.75, 0.75, 0.52);
          break;
        case 2:
          trim.position.set(0.75, -0.75, 0.52);
          break;
        case 3:
          trim.position.set(-0.75, -0.75, 0.52);
          break;
      }
      trimLights.push(trim);
      cabinet.add(trim);
    }

    camera.position.set(0, 0, 5);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.001;
      animationState.current.time = time;

      // Update shader uniforms
      arcadePass.uniforms.time.value = time;
      arcadePass.uniforms.glowIntensity.value = isKonamiCodeActive ? 2 : 1;
      arcadePass.uniforms.scanlineIntensity.value = isAnimating ? 1 : 0.5;

      crtPass.uniforms.time.value = time;

      // Cabinet animations
      if (isAnimating) {
        cabinet.rotation.y = Math.sin(time * 2) * 0.1;
        cabinet.position.y = Math.sin(time * 4) * 0.05;
      }

      // Konami code effects
      if (isKonamiCodeActive) {
        cabinet.rotation.y = Math.sin(time * 4) * 0.2;
        cabinet.position.y = Math.sin(time * 8) * 0.1;

        trimLights.forEach((trim, i) => {
          const intensity = (Math.sin(time * 4 + i) + 1) * 0.5;
          (trim.material as THREE.MeshPhysicalMaterial).emissiveIntensity =
            intensity;
        });
      }

      // Render with post-processing
      composer.render();
    }

    // Event handlers
    const handleClick = () => {
      if (!isAnimating) {
        setIsAnimating(true);

        const roast = isKonamiCodeActive
          ? roastEngine.generateKonamiRoast()
          : roastEngine.generateRoast(undefined, isKonamiCodeActive);

        setCurrentRoast(roast);
        if (onRoastGenerated) {
          onRoastGenerated(roast);
        }

        // Reset animation after delay
        setTimeout(() => {
          setIsAnimating(false);
          if (isKonamiCodeActive) {
            resetKonamiCode();
          }
        }, 5000);
      }
    };

    containerRef.current.addEventListener('click', handleClick);

    // Start animation
    animate();

    // Cleanup
    return () => {
      containerRef.current?.removeEventListener('click', handleClick);
      containerRef.current?.removeChild(renderer.domElement);
      composer.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="w-full h-[600px] cursor-pointer"
        style={{
          background: 'linear-gradient(to bottom, #000033, #000066)',
        }}
      />
      {currentRoast && (
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                     bg-black bg-opacity-80 p-4 rounded-lg text-center max-w-md"
        >
          <p className="text-[#00ff00] text-xl font-mono">{currentRoast}</p>
        </div>
      )}
      {progress > 0 && progress < 1 && (
        <div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2
                     bg-black bg-opacity-50 px-2 py-1 rounded"
        >
          <p className="text-[#00ff00] text-sm font-mono">
            Konami Progress: {Math.round(progress * 100)}%
          </p>
        </div>
      )}
    </div>
  );
}

export default RoastMachine;

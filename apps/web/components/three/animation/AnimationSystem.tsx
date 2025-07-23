import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useAnimations } from '@react-three/drei';
import { GLTFResult } from '../../../types/loader-types';

interface AnimationState {
  current: string;
  previous: string | null;
  transitioning: boolean;
  progress: number;
  duration: number;
}

interface AnimationConfig {
  name: string;
  duration?: number;
  speed?: number;
  loop?: boolean;
  blendDuration?: number;
  startAt?: number;
  weight?: number;
  clamp?: boolean;
}

interface AnimationSystemProps {
  gltf: GLTFResult;
  animations?: AnimationConfig[];
  defaultAnimation?: string;
  onAnimationComplete?: (animationName: string) => void;
  onAnimationLoop?: (animationName: string) => void;
  onBlendComplete?: (from: string, to: string) => void;
}

const AnimationSystem: React.FC<AnimationSystemProps> = ({
  gltf,
  animations = [],
  defaultAnimation,
  onAnimationComplete,
  onAnimationLoop,
  onBlendComplete
}) => {
  const groupRef = useRef<THREE.Group>();
  const { actions, names } = useAnimations(gltf.animations, groupRef);
  const animationStateRef = useRef<AnimationState>({
    current: defaultAnimation || names[0] || '',
    previous: null,
    transitioning: false,
    progress: 0,
    duration: 0
  });

  // Initialize animations
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;

    // Setup each animation with its config
    animations.forEach(config => {
      const action = actions[config.name];
      if (action) {
        action.setLoop(config.loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
        action.clampWhenFinished = config.clamp ?? true;
        if (config.speed) action.setEffectiveTimeScale(config.speed);
        if (config.weight) action.setEffectiveWeight(config.weight);
      }
    });

    // Start default animation if specified
    if (defaultAnimation && actions[defaultAnimation]) {
      actions[defaultAnimation].reset().play();
      animationStateRef.current.current = defaultAnimation;
    }

    return () => {
      // Cleanup animations
      Object.values(actions).forEach(action => action.stop());
    };
  }, [actions, animations, defaultAnimation]);

  const blendAnimations = (
    from: string,
    to: string,
    duration: number = 0.5
  ) => {
    const fromAction = actions[from];
    const toAction = actions[to];

    if (!fromAction || !toAction) return;

    // Setup the new animation
    toAction.reset();
    toAction.setEffectiveTimeScale(1);
    toAction.setEffectiveWeight(0);
    toAction.play();

    // Create the crossfade
    const blend = (alpha: number) => {
      fromAction.setEffectiveWeight(1 - alpha);
      toAction.setEffectiveWeight(alpha);
    };

    // Animate the blend
    let startTime = performance.now();
    const animate = () => {
      const currentTime = performance.now();
      const elapsed = (currentTime - startTime) / 1000;
      const alpha = Math.min(elapsed / duration, 1);

      blend(alpha);

      if (alpha < 1) {
        requestAnimationFrame(animate);
      } else {
        fromAction.stop();
        animationStateRef.current.transitioning = false;
        onBlendComplete?.(from, to);
      }
    };

    animationStateRef.current.transitioning = true;
    requestAnimationFrame(animate);
  };

  useFrame((state, delta) => {
    if (!groupRef.current || !actions) return;

    const currentState = animationStateRef.current;
    const currentAction = actions[currentState.current];

    if (currentAction) {
      // Update animation progress
      currentState.progress = currentAction.time / currentAction.getClip().duration;
      currentState.duration = currentAction.getClip().duration;

      // Check for animation completion
      if (!currentAction.loop && currentState.progress >= 1) {
        onAnimationComplete?.(currentState.current);
      }

      // Check for animation loop
      if (currentAction.loop && currentState.progress >= 1) {
        onAnimationLoop?.(currentState.current);
      }
    }
  });

  // Public API for controlling animations
  const api = {
    play: (name: string, blendDuration?: number) => {
      if (!actions[name] || name === animationStateRef.current.current) return;

      const config = animations.find(a => a.name === name);
      blendAnimations(
        animationStateRef.current.current,
        name,
        blendDuration ?? config?.blendDuration ?? 0.5
      );
      animationStateRef.current.previous = animationStateRef.current.current;
      animationStateRef.current.current = name;
    },
    
    pause: (name?: string) => {
      const actionName = name || animationStateRef.current.current;
      actions[actionName]?.paused = true;
    },

    resume: (name?: string) => {
      const actionName = name || animationStateRef.current.current;
      actions[actionName]?.paused = false;
    },

    stop: (name?: string) => {
      const actionName = name || animationStateRef.current.current;
      actions[actionName]?.stop();
    },

    setSpeed: (speed: number, name?: string) => {
      const actionName = name || animationStateRef.current.current;
      actions[actionName]?.setEffectiveTimeScale(speed);
    },

    getProgress: (name?: string) => {
      const actionName = name || animationStateRef.current.current;
      const action = actions[actionName];
      if (!action) return 0;
      return action.time / action.getClip().duration;
    },

    getCurrentAnimation: () => animationStateRef.current.current,
    
    isTransitioning: () => animationStateRef.current.transitioning
  };

  // Expose the animation API through a ref
  return <primitive object={gltf.scene} ref={groupRef} />;
};

export default AnimationSystem;

// Animation presets
export const animationPresets = {
  fadeIn: {
    duration: 1,
    speed: 1,
    loop: false,
    blendDuration: 0.5,
    weight: 1,
    clamp: true
  },
  fadeOut: {
    duration: 1,
    speed: 1,
    loop: false,
    blendDuration: 0.5,
    weight: 0,
    clamp: true
  },
  loop: {
    duration: 2,
    speed: 1,
    loop: true,
    blendDuration: 0.3,
    weight: 1,
    clamp: false
  }
} as const;

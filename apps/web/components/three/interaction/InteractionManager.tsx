import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { ThreeEvent } from '../../../types/three-types';

interface InteractionState {
  hoveredObject: THREE.Object3D | null;
  selectedObject: THREE.Object3D | null;
  lastClickTime: number;
  clickCount: number;
  dragStart: THREE.Vector2 | null;
  isDragging: boolean;
}

interface InteractionEvent extends ThreeEvent<MouseEvent> {
  clickCount?: number;
  dragDelta?: THREE.Vector2;
  pinchScale?: number;
  rotationDelta?: number;
}

interface InteractionConfig {
  enableHover?: boolean;
  enableClick?: boolean;
  enableDrag?: boolean;
  enablePinch?: boolean;
  enableRotate?: boolean;
  doubleClickDelay?: number;
  dragThreshold?: number;
  hoverDelay?: number;
}

interface InteractionCallbacks {
  onHoverStart?: (event: InteractionEvent) => void;
  onHoverEnd?: (event: InteractionEvent) => void;
  onClick?: (event: InteractionEvent) => void;
  onDoubleClick?: (event: InteractionEvent) => void;
  onDragStart?: (event: InteractionEvent) => void;
  onDrag?: (event: InteractionEvent) => void;
  onDragEnd?: (event: InteractionEvent) => void;
  onPinchStart?: (event: InteractionEvent) => void;
  onPinch?: (event: InteractionEvent) => void;
  onPinchEnd?: (event: InteractionEvent) => void;
  onRotateStart?: (event: InteractionEvent) => void;
  onRotate?: (event: InteractionEvent) => void;
  onRotateEnd?: (event: InteractionEvent) => void;
}

interface InteractionManagerProps extends InteractionConfig, InteractionCallbacks {
  children: React.ReactNode;
}

const InteractionManager: React.FC<InteractionManagerProps> = ({
  children,
  enableHover = true,
  enableClick = true,
  enableDrag = true,
  enablePinch = true,
  enableRotate = true,
  doubleClickDelay = 300,
  dragThreshold = 5,
  hoverDelay = 100,
  onHoverStart,
  onHoverEnd,
  onClick,
  onDoubleClick,
  onDragStart,
  onDrag,
  onDragEnd,
  onPinchStart,
  onPinch,
  onPinchEnd,
  onRotateStart,
  onRotate,
  onRotateEnd
}) => {
  const { camera, scene, gl, raycaster } = useThree();
  const state = useRef<InteractionState>({
    hoveredObject: null,
    selectedObject: null,
    lastClickTime: 0,
    clickCount: 0,
    dragStart: null,
    isDragging: false
  });

  const mouse = useRef(new THREE.Vector2());
  const touches = useRef<Touch[]>([]);
  const hoverTimeout = useRef<NodeJS.Timeout>();

  // Raycasting for object detection
  const getIntersectedObject = (x: number, y: number) => {
    mouse.current.x = (x / gl.domElement.clientWidth) * 2 - 1;
    mouse.current.y = -(y / gl.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse.current, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    return intersects.length > 0 ? intersects[0].object : null;
  };

  // Mouse event handlers
  const handleMouseMove = (event: MouseEvent) => {
    if (!enableHover && !enableDrag) return;

    const { clientX, clientY } = event;
    const intersectedObject = getIntersectedObject(clientX, clientY);

    if (state.current.isDragging && enableDrag) {
      const dragDelta = new THREE.Vector2(
        event.movementX,
        event.movementY
      );

      onDrag?.({
        ...event,
        object: state.current.selectedObject!,
        dragDelta
      } as InteractionEvent);
    } else if (enableHover) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = setTimeout(() => {
        if (intersectedObject !== state.current.hoveredObject) {
          if (state.current.hoveredObject) {
            onHoverEnd?.({
              ...event,
              object: state.current.hoveredObject
            } as InteractionEvent);
          }
          if (intersectedObject) {
            onHoverStart?.({
              ...event,
              object: intersectedObject
            } as InteractionEvent);
          }
          state.current.hoveredObject = intersectedObject;
        }
      }, hoverDelay);
    }
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (!enableClick && !enableDrag) return;

    const { clientX, clientY } = event;
    const intersectedObject = getIntersectedObject(clientX, clientY);

    if (intersectedObject) {
      state.current.selectedObject = intersectedObject;
      state.current.dragStart = new THREE.Vector2(clientX, clientY);

      const now = Date.now();
      if (now - state.current.lastClickTime < doubleClickDelay) {
        state.current.clickCount++;
        if (state.current.clickCount === 2) {
          onDoubleClick?.({
            ...event,
            object: intersectedObject
          } as InteractionEvent);
          state.current.clickCount = 0;
        }
      } else {
        state.current.clickCount = 1;
      }
      state.current.lastClickTime = now;
    }
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (!enableClick && !enableDrag) return;

    if (state.current.selectedObject) {
      if (state.current.isDragging) {
        onDragEnd?.({
          ...event,
          object: state.current.selectedObject
        } as InteractionEvent);
        state.current.isDragging = false;
      } else {
        onClick?.({
          ...event,
          object: state.current.selectedObject,
          clickCount: state.current.clickCount
        } as InteractionEvent);
      }
    }

    state.current.selectedObject = null;
    state.current.dragStart = null;
  };

  // Touch event handlers
  const handleTouchStart = (event: TouchEvent) => {
    event.preventDefault();
    touches.current = Array.from(event.touches);

    if (touches.current.length === 1) {
      handleMouseDown({
        clientX: touches.current[0].clientX,
        clientY: touches.current[0].clientY
      } as MouseEvent);
    } else if (touches.current.length === 2) {
      onPinchStart?.({} as InteractionEvent);
      onRotateStart?.({} as InteractionEvent);
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    const currentTouches = Array.from(event.touches);

    if (currentTouches.length === 1) {
      handleMouseMove({
        clientX: currentTouches[0].clientX,
        clientY: currentTouches[0].clientY,
        movementX: currentTouches[0].clientX - (touches.current[0]?.clientX || 0),
        movementY: currentTouches[0].clientY - (touches.current[0]?.clientY || 0)
      } as MouseEvent);
    } else if (currentTouches.length === 2 && touches.current.length === 2) {
      // Calculate pinch
      const currentDistance = getDistance(currentTouches[0], currentTouches[1]);
      const previousDistance = getDistance(touches.current[0], touches.current[1]);
      const scale = currentDistance / previousDistance;

      // Calculate rotation
      const currentAngle = getAngle(currentTouches[0], currentTouches[1]);
      const previousAngle = getAngle(touches.current[0], touches.current[1]);
      const rotation = currentAngle - previousAngle;

      if (enablePinch) {
        onPinch?.({
          pinchScale: scale
        } as InteractionEvent);
      }

      if (enableRotate) {
        onRotate?.({
          rotationDelta: rotation
        } as InteractionEvent);
      }
    }

    touches.current = currentTouches;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    event.preventDefault();
    if (event.touches.length === 0) {
      handleMouseUp({} as MouseEvent);
      onPinchEnd?.({} as InteractionEvent);
      onRotateEnd?.({} as InteractionEvent);
    }
    touches.current = Array.from(event.touches);
  };

  // Helper functions
  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getAngle = (touch1: Touch, touch2: Touch) => {
    return Math.atan2(
      touch2.clientY - touch1.clientY,
      touch2.clientX - touch1.clientX
    );
  };

  // Event listeners setup
  useEffect(() => {
    const canvas = gl.domElement;

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gl]);

  return <>{children}</>;
};

export default InteractionManager;

// Interaction presets
export const interactionPresets = {
  default: {
    enableHover: true,
    enableClick: true,
    enableDrag: true,
    enablePinch: true,
    enableRotate: true,
    doubleClickDelay: 300,
    dragThreshold: 5,
    hoverDelay: 100
  },
  minimal: {
    enableHover: true,
    enableClick: true,
    enableDrag: false,
    enablePinch: false,
    enableRotate: false,
    doubleClickDelay: 300,
    hoverDelay: 100
  },
  touch: {
    enableHover: false,
    enableClick: true,
    enableDrag: true,
    enablePinch: true,
    enableRotate: true,
    dragThreshold: 10
  }
} as const;

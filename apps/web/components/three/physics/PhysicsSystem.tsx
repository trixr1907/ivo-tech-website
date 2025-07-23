import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import * as CANNON from 'cannon-es';
import { ThreeEvent } from '../../../types/three-types';

interface PhysicsState {
  world: CANNON.World;
  bodies: Map<THREE.Object3D, CANNON.Body>;
  constraints: CANNON.Constraint[];
}

interface PhysicsConfig {
  gravity?: [number, number, number];
  iterations?: number;
  defaultMaterial?: {
    friction?: number;
    restitution?: number;
  };
  debug?: boolean;
  autoSimulation?: boolean;
  substeps?: number;
}

interface ColliderConfig {
  type: 'box' | 'sphere' | 'cylinder' | 'plane' | 'convex' | 'trimesh';
  mass?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  dimensions?: [number, number, number];
  radius?: number;
  height?: number;
  friction?: number;
  restitution?: number;
  group?: number;
  mask?: number;
}

interface PhysicsCallbacks {
  onCollide?: (event: { body: CANNON.Body; target: CANNON.Body; contact: CANNON.ContactEquation }) => void;
  onWake?: (body: CANNON.Body) => void;
  onSleep?: (body: CANNON.Body) => void;
}

interface PhysicsSystemProps extends PhysicsConfig, PhysicsCallbacks {
  children: React.ReactNode;
}

const PhysicsSystem: React.FC<PhysicsSystemProps> = ({
  children,
  gravity = [0, -9.81, 0],
  iterations = 10,
  defaultMaterial = { friction: 0.3, restitution: 0.3 },
  debug = false,
  autoSimulation = true,
  substeps = 1,
  onCollide,
  onWake,
  onSleep
}) => {
  const { scene } = useThree();
  const physicsRef = useRef<PhysicsState>({
    world: new CANNON.World(),
    bodies: new Map(),
    constraints: []
  });

  // Initialize physics world
  useEffect(() => {
    const world = physicsRef.current.world;
    
    // Configure world
    world.gravity.set(...gravity);
    world.solver.iterations = iterations;
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.allowSleep = true;

    // Create default material
    const defaultCannonMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultCannonMaterial,
      defaultCannonMaterial,
      {
        friction: defaultMaterial.friction,
        restitution: defaultMaterial.restitution
      }
    );
    world.addContactMaterial(defaultContactMaterial);
    world.defaultContactMaterial = defaultContactMaterial;

    return () => {
      // Cleanup physics objects
      physicsRef.current.bodies.forEach(body => {
        world.removeBody(body);
      });
      physicsRef.current.constraints.forEach(constraint => {
        world.removeConstraint(constraint);
      });
    };
  }, [gravity, iterations, defaultMaterial]);

  // Debug visualization
  useEffect(() => {
    if (debug) {
      const debugMaterial = new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0x00ff00
      });

      physicsRef.current.bodies.forEach((body, object) => {
        body.shapes.forEach(shape => {
          let geometry: THREE.BufferGeometry;

          if (shape instanceof CANNON.Box) {
            geometry = new THREE.BoxGeometry(
              shape.halfExtents.x * 2,
              shape.halfExtents.y * 2,
              shape.halfExtents.z * 2
            );
          } else if (shape instanceof CANNON.Sphere) {
            geometry = new THREE.SphereGeometry(shape.radius);
          } else if (shape instanceof CANNON.Cylinder) {
            geometry = new THREE.CylinderGeometry(
              shape.radiusTop,
              shape.radiusBottom,
              shape.height
            );
          } else {
            return;
          }

          const mesh = new THREE.Mesh(geometry, debugMaterial);
          mesh.position.copy(object.position as any);
          mesh.quaternion.copy(object.quaternion as any);
          scene.add(mesh);
        });
      });
    }
  }, [debug, scene]);

  // Add physics body to object
  const addPhysics = (
    object: THREE.Object3D,
    config: ColliderConfig
  ) => {
    const { world, bodies } = physicsRef.current;
    let shape: CANNON.Shape;

    // Create shape based on type
    switch (config.type) {
      case 'box':
        shape = new CANNON.Box(new CANNON.Vec3(
          ...((config.dimensions || [1, 1, 1]).map(d => d / 2))
        ));
        break;
      case 'sphere':
        shape = new CANNON.Sphere(config.radius || 1);
        break;
      case 'cylinder':
        shape = new CANNON.Cylinder(
          config.radius || 1,
          config.radius || 1,
          config.height || 2,
          16
        );
        break;
      case 'plane':
        shape = new CANNON.Plane();
        break;
      case 'convex':
        if (object instanceof THREE.Mesh) {
          const geometry = object.geometry;
          const vertices = Array.from(geometry.attributes.position.array);
          shape = new CANNON.ConvexPolyhedron({
            vertices: vertices.reduce((acc: number[][], _, i) => {
              if (i % 3 === 0) {
                acc.push(vertices.slice(i, i + 3));
              }
              return acc;
            }, []) as any,
            faces: []
          });
        } else {
          throw new Error('Convex collider requires a mesh object');
        }
        break;
      case 'trimesh':
        if (object instanceof THREE.Mesh) {
          const geometry = object.geometry;
          const vertices = Array.from(geometry.attributes.position.array);
          const indices = Array.from(geometry.index?.array || []);
          shape = new CANNON.Trimesh(vertices as any, indices);
        } else {
          throw new Error('Trimesh collider requires a mesh object');
        }
        break;
      default:
        throw new Error(`Unknown collider type: ${config.type}`);
    }

    // Create body
    const body = new CANNON.Body({
      mass: config.mass || 0,
      position: new CANNON.Vec3(...(config.position || [0, 0, 0])),
      quaternion: new CANNON.Quaternion().setFromEuler(
        ...(config.rotation || [0, 0, 0])
      ),
      shape,
      material: world.defaultMaterial,
      collisionFilterGroup: config.group || 1,
      collisionFilterMask: config.mask || -1
    });

    // Add event listeners
    body.addEventListener('collide', (event: any) => {
      onCollide?.(event);
    });
    body.addEventListener('wakeup', () => {
      onWake?.(body);
    });
    body.addEventListener('sleep', () => {
      onSleep?.(body);
    });

    // Add body to world and map
    world.addBody(body);
    bodies.set(object, body);

    return body;
  };

  // Add constraint between bodies
  const addConstraint = (
    bodyA: CANNON.Body,
    bodyB: CANNON.Body,
    type: 'point' | 'distance' | 'hinge' | 'lock',
    options: any = {}
  ) => {
    let constraint: CANNON.Constraint;

    switch (type) {
      case 'point':
        constraint = new CANNON.PointToPointConstraint(
          bodyA,
          options.pivotA || new CANNON.Vec3(),
          bodyB,
          options.pivotB || new CANNON.Vec3(),
          options.maxForce
        );
        break;
      case 'distance':
        constraint = new CANNON.DistanceConstraint(
          bodyA,
          bodyB,
          options.distance,
          options.maxForce
        );
        break;
      case 'hinge':
        constraint = new CANNON.HingeConstraint(
          bodyA,
          bodyB,
          {
            pivotA: options.pivotA || new CANNON.Vec3(),
            axisA: options.axisA || new CANNON.Vec3(1, 0, 0),
            pivotB: options.pivotB || new CANNON.Vec3(),
            axisB: options.axisB || new CANNON.Vec3(1, 0, 0),
            maxForce: options.maxForce
          }
        );
        break;
      case 'lock':
        constraint = new CANNON.LockConstraint(
          bodyA,
          bodyB,
          { maxForce: options.maxForce }
        );
        break;
      default:
        throw new Error(`Unknown constraint type: ${type}`);
    }

    physicsRef.current.world.addConstraint(constraint);
    physicsRef.current.constraints.push(constraint);

    return constraint;
  };

  // Update physics world
  useFrame((state, delta) => {
    if (!autoSimulation) return;

    const { world, bodies } = physicsRef.current;
    
    // Update world
    world.step(1 / 60, delta, substeps);

    // Update object positions
    bodies.forEach((body, object) => {
      object.position.copy(body.position as any);
      object.quaternion.copy(body.quaternion as any);
    });
  });

  // Expose physics API
  const api = {
    world: physicsRef.current.world,
    addPhysics,
    addConstraint,
    bodies: physicsRef.current.bodies,
    constraints: physicsRef.current.constraints
  };

  return <>{children}</>;
};

export default PhysicsSystem;

// Physics presets
export const physicsPresets = {
  default: {
    gravity: [0, -9.81, 0],
    iterations: 10,
    defaultMaterial: {
      friction: 0.3,
      restitution: 0.3
    },
    autoSimulation: true,
    substeps: 1
  },
  space: {
    gravity: [0, 0, 0],
    iterations: 10,
    defaultMaterial: {
      friction: 0.1,
      restitution: 0.7
    },
    autoSimulation: true,
    substeps: 1
  },
  water: {
    gravity: [0, -9.81, 0],
    iterations: 20,
    defaultMaterial: {
      friction: 0.1,
      restitution: 0.2
    },
    autoSimulation: true,
    substeps: 2
  },
  softBody: {
    gravity: [0, -9.81, 0],
    iterations: 20,
    defaultMaterial: {
      friction: 0.3,
      restitution: 0.1
    },
    autoSimulation: true,
    substeps: 3
  }
} as const;

// Helper functions for common physics setups
export const createRigidBody = (
  object: THREE.Object3D,
  mass: number = 1,
  type: 'box' | 'sphere' = 'box'
) => {
  return {
    type,
    mass,
    position: [
      object.position.x,
      object.position.y,
      object.position.z
    ] as [number, number, number],
    rotation: [
      object.rotation.x,
      object.rotation.y,
      object.rotation.z
    ] as [number, number, number],
    dimensions: object instanceof THREE.Mesh && object.geometry instanceof THREE.BoxGeometry
      ? [
          object.geometry.parameters.width,
          object.geometry.parameters.height,
          object.geometry.parameters.depth
        ]
      : undefined,
    radius: object instanceof THREE.Mesh && object.geometry instanceof THREE.SphereGeometry
      ? object.geometry.parameters.radius
      : undefined
  };
};

export const createStaticPlane = (
  normal: [number, number, number] = [0, 1, 0]
) => {
  return {
    type: 'plane' as const,
    mass: 0,
    rotation: [
      Math.atan2(normal[1], normal[2]),
      Math.atan2(normal[0], normal[2]),
      0
    ]
  };
};

export const createVehicle = (
  chassisBody: CANNON.Body,
  wheelBodies: CANNON.Body[],
  wheelPositions: CANNON.Vec3[]
) => {
  const vehicle = new CANNON.RaycastVehicle({
    chassisBody,
    indexRightAxis: 0,
    indexForwardAxis: 2,
    indexUpAxis: 1
  });

  wheelPositions.forEach((position, i) => {
    vehicle.addWheel({
      radius: wheelBodies[i].shapes[0] instanceof CANNON.Sphere
        ? (wheelBodies[i].shapes[0] as CANNON.Sphere).radius
        : 0.5,
      directionLocal: new CANNON.Vec3(0, -1, 0),
      suspensionStiffness: 30,
      suspensionRestLength: 0.3,
      frictionSlip: 5,
      dampingRelaxation: 2.3,
      dampingCompression: 4.4,
      maxSuspensionForce: 100000,
      rollInfluence: 0.01,
      axleLocal: new CANNON.Vec3(-1, 0, 0),
      chassisConnectionPointLocal: position,
      useCustomSlidingRotationalSpeed: true,
      customSlidingRotationalSpeed: -30
    });
  });

  return vehicle;
};

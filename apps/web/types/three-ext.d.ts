declare module 'three/examples/jsm/postprocessing/EffectComposer' {
  import { WebGLRenderer } from 'three';

  export class EffectComposer {
    constructor(renderer: WebGLRenderer);
    addPass(pass: any): void;
    render(): void;
    dispose(): void;
  }
}

declare module 'three/examples/jsm/postprocessing/RenderPass' {
  import { Scene, Camera } from 'three';

  export class RenderPass {
    constructor(scene: Scene, camera: Camera);
  }
}

declare module 'three/examples/jsm/postprocessing/UnrealBloomPass' {
  import { Vector2 } from 'three';

  export class UnrealBloomPass {
    constructor(resolution: Vector2, strength: number, radius: number, threshold: number);
  }
}

declare module 'three/examples/jsm/postprocessing/OutputPass' {
  export class OutputPass {
    constructor();
  }
}

declare module 'three/examples/jsm/postprocessing/ShaderPass' {
  export class ShaderPass {
    constructor(shader: any);
  }
}

declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import { Object3D, LoadingManager } from 'three';

  export class GLTFLoader {
    constructor(manager?: LoadingManager);
    load(url: string, onLoad: (gltf: { scene: Object3D }) => void): void;
  }
}

declare module 'three/examples/jsm/loaders/DRACOLoader' {
  import { LoadingManager } from 'three';

  export class DRACOLoader {
    constructor(manager?: LoadingManager);
    setDecoderPath(path: string): this;
  }
}

declare module 'three/examples/jsm/loaders/KTX2Loader' {
  import { LoadingManager } from 'three';

  export class KTX2Loader {
    constructor(manager?: LoadingManager);
    setTranscoderPath(path: string): this;
  }
}

// Erweitere bestehende Three.js-Typen
declare module 'three' {
  interface WebGLRenderer {
    info: {
      memory: {
        geometries: number;
        textures: number;
      };
      render: {
        calls: number;
        triangles: number;
        points: number;
        lines: number;
      };
    };
  }

  interface Mesh {
    add(object: Object3D): this;
  }

  interface Performance {
    memory: {
      usedJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}

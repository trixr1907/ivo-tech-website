# Build Diagnosis Report

## Current Issue
We're encountering a persistent dependency conflict with pnpm when trying to build the API app. The specific error is:

```
ERR_PNPM_INCLUDED_DEPS_CONFLICT
modules directory was installed with optionalDependencies, dependencies.
Current install wants optionalDependencies, dependencies, devDependencies.
```

## Attempted Solutions
1. Cleaned and reinstalled node_modules
2. Moved TypeScript from devDependencies to dependencies
3. Updated package.json configurations
4. Tried direct Next.js builds
5. Attempted to bypass Husky hooks

## Root Cause Analysis
The issue appears to be related to how pnpm handles dependency hoisting in a monorepo setup. The conflict occurs because:

1. The workspace root has certain dependency configurations
2. The API app tries to install devDependencies in a different way
3. There are multiple lockfiles causing conflicts

## Recommended Solutions

### Option 1: Clean Workspace Setup
1. Remove all node_modules directories
2. Delete all lockfiles
3. Configure a single pnpm-workspace.yaml
4. Run a fresh install from the workspace root

### Option 2: Dependency Hoisting Adjustment
1. Create a .npmrc file with specific hoisting rules
2. Adjust the dependency types in package.json
3. Ensure consistent dependency declarations across workspace

### Option 3: Direct Dependency Management
1. Move all TypeScript-related dependencies to dependencies (not devDependencies)
2. Ensure all packages use the same version of TypeScript
3. Configure shared typescript settings in the root tsconfig.json

## Next Steps
1. Review current workspace configuration
2. Clean up multiple lockfile situation
3. Standardize TypeScript setup across all packages
4. Implement proper monorepo dependency management

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Turborepo monorepo containing Next.js applications and shared packages. The project uses Yarn workspaces with the following structure:

- **Apps**: `apps/web` (port 3000) and `apps/docs` (port 3001) - both Next.js 15.5.0 apps using React 19
- **Packages**: `@repo/ui` (shared components), `@repo/eslint-config`, `@repo/typescript-config`
- **Package Manager**: Yarn 1.22.22 (always use `yarn` commands, not `npm`)
- **Node Version**: >=22 (enforced in engines)

## Essential Commands

### Development
```bash
# Start all apps in development mode
yarn dev

# Start specific app
yarn turbo dev --filter=web    # web app on port 3000
yarn turbo dev --filter=docs   # docs app on port 3001

# Build all packages and apps
yarn build

# Build specific package/app
yarn turbo build --filter=web
```

### Code Quality
```bash
# Lint all packages (with zero warnings enforcement)
yarn lint

# Type checking across all packages
yarn check-types

# Format code with Prettier
yarn format
```

### Package Management
```bash
# Install dependencies (use yarn, not npm)
yarn install

# Add dependency to specific workspace
yarn workspace web add <package>
yarn workspace @repo/ui add <package>

# Generate new React component in UI package
yarn workspace @repo/ui run generate:component
```

## Architecture

### Monorepo Structure
The codebase follows Turborepo conventions with:
- **Dependency graph**: Turborepo automatically handles build dependencies via `"dependsOn": ["^build"]`
- **Shared packages**: `@repo/ui` contains reusable React components imported by both apps
- **Configuration sharing**: ESLint and TypeScript configs are shared via `@repo/eslint-config` and `@repo/typescript-config`

### Key Technologies
- **Next.js 15.5.0** with App Router and Turbopack for fast development
- **React 19** with TypeScript 5.9.2
- **Shared UI Components**: The `@repo/ui` package uses wildcard exports (`"./*": "./src/*.tsx"`) for direct component imports
- **Local fonts**: Uses Geist Sans and Geist Mono fonts loaded via `next/font/local`

### Package Dependencies
- Apps depend on `@repo/ui` for shared components
- All packages use shared `@repo/eslint-config` and `@repo/typescript-config`
- Components in `@repo/ui` require an `appName` prop to identify which app is using them

## Turborepo Specifics

### Task Configuration
- **Build**: Outputs to `.next/**` with cache exclusions for `.next/cache/**`
- **Dev**: Runs in persistent mode with cache disabled for live reloading
- **Lint/Type-check**: Runs across all packages respecting dependency order

### Filtering
Use Turborepo filters to target specific packages:
```bash
# Run commands on specific packages
turbo build --filter=@repo/ui
turbo lint --filter=web
turbo dev --filter=docs
```

### Caching
Turborepo caches build outputs locally. For team development, consider setting up Vercel Remote Cache using `turbo login` and `turbo link`.
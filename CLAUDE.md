# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Setup
- `npm install` - Install dependencies

## Architecture Overview

This is a **Vue 3 Composition API learning project** using a branch-based educational structure. Each Git branch focuses on specific Composition API concepts, with the main branch being `basciComputed`.

### Tech Stack
- **Vue 3.2.45** with Composition API and `<script setup>` syntax
- **Vite 3.2.4** for build tooling and development server
- **Vue Router 4.1.6** for client-side routing
- **Pinia 2.0.26** for state management (modern Vuex replacement)

### Project Structure
- `src/main.js` - Application entry point with Pinia and Router setup
- `src/App.vue` - Root component (minimal RouterView wrapper)
- `src/router/index.js` - Vue Router configuration with dynamic imports
- `src/stores/counter.js` - Pinia store using Composition API pattern
- `src/views/` - Route-level components
- `src/components/` - Reusable components
- `vite.config.js` - Vite configuration with `@` alias for `src/`

### Learning Branch System

The project uses **Git branches as learning modules**:
- `basciComputed` (main) - Computed properties
- `basicReactiveExample` - Reactive basics  
- `differentRefAndReactiveAndWatch` - Ref vs Reactive vs Watch
- `refIsProxyObjSoDeclareByConst` - Ref proxy concepts
- `refIsReactivityData` - Ref reactivity deep dive
- `sendComponentMustDefinePropsType` - Props typing
- `setupNoSugar` / `setupWithSugar` - Setup function variations
- `vue-watch-advanced` - Advanced watch concepts

### Key Patterns

**Composition API with Script Setup:**
```vue
<script setup>
import { ref, computed } from 'vue'
const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>
```

**Pinia Store Pattern:**
```javascript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, doubleCount, increment }
})
```

**Router Dynamic Imports:**
```javascript
component: () => import("../views/AboutView.vue") // 動態引入
```

## Development Guidelines

- Use **Traditional Chinese** for documentation and comments
- Follow **`<script setup>` syntax** consistently
- Keep examples **simple and educational** - this is a learning project
- Each branch should focus on **one specific concept**
- Use **Composition API** over Options API
- Maintain **Pinia stores** with Composition API pattern
- Leverage **Vite's fast development server** for quick iterations

## Branch Navigation

To switch between learning modules:
```sh
git checkout <branch-name>
```

Each branch contains focused examples for specific Vue 3 Composition API concepts with detailed Chinese documentation.
# AGENTS.md - Development Guidelines

This document provides guidelines for AI coding assistants and developers working on this React + Vite project.

## Project Overview

**MyXmasSynth** - A React-based audio synthesizer application with custom hooks and modular component architecture.

## Tech Stack

- **React**: v19.2.0
- **Vite**: v7.2.4 (Build tool)
- **SCSS**: For styling
- **Biome**: For linting and formatting
- **Web Audio API**: For audio synthesis

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Component.jsx    # Component logic
│   │   └── Component.scss   # Component styles (co-located)
│   ├── hooks/               # Custom React hooks
│   │   └── useAudioPlayer.js
│   ├── constants/           # Shared constants and configurations
│   │   └── melodies.js
│   ├── assets/              # Static assets
│   ├── App.jsx              # Main application component
│   ├── App.scss             # Application-level styles
│   ├── index.scss           # Global styles
│   └── main.jsx             # Application entry point
├── public/                  # Static public assets
└── package.json
```

## Coding Best Practices

### Component Architecture

1. **Functional Components Only**: Use function declarations, not arrow functions for components
   ```jsx
   export default function MyComponent({ prop1, prop2 }) {
     // component logic
   }
   ```

2. **Props Documentation**: Always include JSDoc comments documenting props
   ```jsx
   /**
    * Brief component description
    * @param {type} propName - Description of the prop
    */
   ```

3. **Co-located Styles**: Each component should have its corresponding SCSS file
   ```
   AudioControls.jsx
   AudioControls.scss
   ```

4. **Component Composition**: Break down complex UIs into smaller, reusable components
   - Keep components focused on a single responsibility
   - Use props for configuration and callbacks

### Custom Hooks

1. **Location**: Place all custom hooks in `src/hooks/` directory

2. **Naming Convention**: Prefix with `use` (e.g., `useAudioPlayer`)

3. **Documentation**: Include JSDoc with parameter and return type descriptions
   ```javascript
   /**
    * Custom hook description
    * @param {number} param1 - Description
    * @returns {object} Returned values and methods
    */
   ```

4. **Separation of Concerns**: 
   - Encapsulate complex state logic
   - Handle side effects (useEffect, useRef)
   - Return state and control functions

5. **Example Pattern**:
   ```javascript
   export function useCustomHook(initialValue) {
     const [state, setState] = useState(initialValue)
     const ref = useRef(null)
     
     useEffect(() => {
       // side effects
     }, [dependencies])
     
     return { state, someMethod }
   }
   ```

### State Management

1. **useState**: For simple component-level state
2. **useRef**: For mutable values that don't trigger re-renders (DOM references, timers, audio contexts)
3. **Lift State Up**: Share state between components by lifting it to the nearest common ancestor

### Styling with SCSS

1. **File Organization**: One SCSS file per component, co-located with the component

2. **Import Pattern**: Import SCSS at the top of each component file
   ```jsx
   import './ComponentName.scss'
   ```

3. **Class Naming**: Use semantic, descriptive class names (kebab-case)
   ```scss
   .audio-controls {
     // styles
   }
   ```

4. **Avoid Inline Styles**: Prefer SCSS classes except for dynamic values
   - Exception: Dynamic calculations that can't be predetermined

### Accessibility

1. **Semantic HTML**: Use appropriate HTML elements (`button`, not `div`)

2. **ARIA Labels**: Add `aria-label` to interactive elements without text content
   ```jsx
   <button aria-label="Play Sound">▶</button>
   ```

3. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible

4. **Disabled States**: Properly handle disabled states on buttons
   ```jsx
   <button disabled={isPlaying}>Play</button>
   ```

### Code Quality

1. **Linting & Formatting**: Use Biome for consistent code style
   ```bash
   npm run lint        # Check for issues
   npm run lint:fix    # Auto-fix issues
   npm run format      # Format code
   ```

2. **Type Safety**: Use JSDoc comments for type hints (works with IDEs)

3. **Constants**: Extract magic numbers and shared values to `src/constants/`

4. **Naming Conventions**:
   - **Components**: PascalCase (e.g., `AudioControls`)
   - **Hooks**: camelCase with `use` prefix (e.g., `useAudioPlayer`)
   - **Functions**: camelCase (e.g., `playNote`)
   - **Constants**: UPPER_SNAKE_CASE for true constants (e.g., `BASE_FREQUENCY`)
   - **Variables**: camelCase (e.g., `isPlaying`)

### File Naming

- **Components**: PascalCase (e.g., `AudioControls.jsx`)
- **Hooks**: camelCase (e.g., `useAudioPlayer.js`)
- **Styles**: Match component name (e.g., `AudioControls.scss`)
- **Constants**: camelCase (e.g., `melodies.js`)

## Development Workflow

### Running the Project

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Making Changes

1. **Before coding**: Check existing patterns in similar files
2. **Component changes**: Update both `.jsx` and `.scss` files
3. **New features**: Consider if a custom hook would improve code organization
4. **After coding**: Run linting and verify in browser

### Adding New Features

1. **New Component**:
   - Create `ComponentName.jsx` in `src/components/`
   - Create matching `ComponentName.scss`
   - Import styles in component
   - Add JSDoc documentation

2. **New Hook**:
   - Create `useHookName.js` in `src/hooks/`
   - Document parameters and return values
   - Export as named export

3. **New Constants**:
   - Add to appropriate file in `src/constants/`
   - Use UPPER_SNAKE_CASE for truly constant values

## Common Patterns

### Callback Props Pattern
```jsx
// Parent passes handlers
<AudioControls onPlay={play} onStop={stop} />

// Child invokes handlers
<button onClick={onPlay}>Play</button>
```

### Controlled Component Pattern
```jsx
// Parent owns state
const [value, setValue] = useState(50)
<Knob value={value} onChange={setValue} />

// Child reports changes
<input value={value} onChange={(e) => onChange(e.target.value)} />
```

### Ref Pattern for Non-React APIs
```jsx
const audioContextRef = useRef(null)
audioContextRef.current = new AudioContext()
// Access without triggering re-renders
```

## Performance Considerations

1. **useRef for Timers**: Store timeout/interval IDs in refs, not state
2. **Cleanup Effects**: Always clean up timers, listeners, and Web Audio nodes
3. **Prevent Memory Leaks**: Clear refs and stop audio contexts on unmount

## Browser APIs Used

- **Web Audio API**: For sound synthesis and playback
  - AudioContext
  - OscillatorNode
  - GainNode
  - Scheduling and timing

## When to Create New Files

- **New Component**: Any reusable UI element
- **New Hook**: Complex stateful logic used in multiple places
- **New Constants**: Shared configuration or data

## Anti-Patterns to Avoid

❌ Arrow functions for component definitions
❌ Inline styles everywhere (use SCSS)
❌ State for ref-like values (timers, DOM refs)
❌ Missing cleanup in useEffect
❌ Undocumented props
❌ Generic names (e.g., `Component1`, `temp`)

## Questions for AI Assistants

When implementing features, consider:
- Does this need a new component or can it extend an existing one?
- Should this logic be extracted to a custom hook?
- Are there shared constants that should be extracted?
- Does this follow the existing patterns in the codebase?
- Is the code accessible and semantically correct?

---

**Last Updated**: December 2025
**Version**: 1.0.0


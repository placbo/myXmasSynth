# MyXmasSynth - Project Structure

This document outlines the refactored code structure following React best practices.

## Directory Structure

```
src/
├── App.jsx                    # Main application component (clean, focused on composition)
├── App.scss                   # Main application styles
├── main.jsx                   # Application entry point
├── Knob.jsx                   # Reusable knob control component
├── Knob.scss                  # Knob styles
├── components/                # Presentational components
│   ├── AudioControls.jsx      # Play/Stop button controls
│   ├── AudioControls.scss     # Audio controls styles
│   ├── KnobSection.jsx        # Volume and frequency knobs container
│   ├── KnobSection.scss       # Knob section styles
│   ├── StatusDisplay.jsx      # Display current values (volume/frequency)
│   └── StatusDisplay.scss     # Status display styles
├── hooks/                     # Custom React hooks
│   └── useAudioPlayer.js      # Audio playback logic and Web Audio API integration
└── constants/                 # Application constants
    └── melodies.js            # Musical data (melody notes, frequencies)
```

## Architecture Overview

### 1. **Separation of Concerns**
   - **Components** (`/components`): Pure presentational components focused on UI
   - **Hooks** (`/hooks`): Business logic and side effects (audio playback)
   - **Constants** (`/constants`): Static data and configuration

### 2. **App.jsx** (Main Component)
   - **Responsibility**: Application composition and state management
   - **State**: Manages volume and frequency
   - **Clean Design**: ~30 lines (down from 150+)
   - Only contains top-level state and component composition

### 3. **useAudioPlayer Hook** (`/hooks/useAudioPlayer.js`)
   - **Responsibility**: All audio-related logic
   - **Features**:
     - Web Audio API integration
     - Melody playback with looping
     - Real-time volume and frequency control
     - Smooth transitions and envelopes
   - **Returns**: `{ isPlaying, play, stop }`
   - **Benefits**: Reusable, testable, isolated audio logic

### 4. **Components** (`/components`)
   
   #### AudioControls.jsx
   - Play/Stop buttons
   - Handles disabled states based on playing status
   
   #### KnobSection.jsx
   - Container for Volume and Frequency knobs
   - Manages knob layout
   
   #### StatusDisplay.jsx
   - Displays current values
   - Decorative elements (emojis)

### 5. **Constants** (`/constants/melodies.js`)
   - Musical data (Christmas melody notes)
   - Base frequency reference
   - Easy to extend with more melodies

## Benefits of This Structure

1. **Maintainability**: Each file has a single responsibility
2. **Readability**: Clear file names and organization
3. **Reusability**: Components and hooks can be easily reused
4. **Testability**: Isolated logic is easier to unit test
5. **Scalability**: Easy to add new features (e.g., more melodies, effects)
6. **Documentation**: JSDoc comments on functions and components

## How to Add Features

### Add a New Melody
1. Edit `src/constants/melodies.js`
2. Export a new melody array
3. Update the hook to use the new melody

### Add a New Control
1. Create component in `src/components/`
2. Add to `App.jsx` composition
3. Connect to relevant state/hooks

### Add Audio Effects
1. Extend `useAudioPlayer.js` hook
2. Add new parameters
3. Wire to UI controls

## Code Quality

- ✅ Follows React best practices
- ✅ Component composition over inheritance
- ✅ Custom hooks for side effects
- ✅ JSDoc documentation
- ✅ Semantic naming
- ✅ Single Responsibility Principle
- ✅ DRY (Don't Repeat Yourself)


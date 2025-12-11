import { useState, useRef, useEffect } from 'react'

import './App.scss'
import Knob from './Knob'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [knobValue, setKnobValue] = useState(50)
  const [frequency, setFrequency] = useState(440) // A4 note
  const audioContextRef = useRef(null)
  const oscillatorRef = useRef(null)
  const gainNodeRef = useRef(null)
  const timeoutRefs = useRef([])
  const shouldLoopRef = useRef(false)
  const activeOscillatorsRef = useRef([])
  const melodyIndexRef = useRef(0)

  // Simple Christmas melody: Jingle Bells (first few notes)
  // Note frequencies and durations
  const christmasMelody = [
    { freq: 329.63, duration: 0.25 }, // E4
    { freq: 329.63, duration: 0.25 }, // E4
    { freq: 329.63, duration: 0.5 },  // E4
    { freq: 329.63, duration: 0.25 }, // E4
    { freq: 329.63, duration: 0.25 }, // E4
    { freq: 329.63, duration: 0.5 },  // E4
    { freq: 329.63, duration: 0.25 }, // E4
    { freq: 392, duration: 0.25 }, // G4
    { freq: 261.63, duration: 0.25 }, // C4
    { freq: 293.66, duration: 0.25 }, // D4
    { freq: 329.63, duration: 1 },  // E4
  ]

  const playSound = () => {
    if (isPlaying) return // Prevent multiple play
    const audioContext = new globalThis.AudioContext()
    const gainNode = audioContext.createGain()

    gainNode.connect(audioContext.destination)
    gainNode.gain.setValueAtTime(knobValue / 100, audioContext.currentTime)

    audioContextRef.current = audioContext
    gainNodeRef.current = gainNode
    setIsPlaying(true)
    shouldLoopRef.current = true
    melodyIndexRef.current = 0

    // Function to play one note with real-time frequency control
    const playNote = (noteIndex) => {
      if (!shouldLoopRef.current || !audioContextRef.current) return

      const note = christmasMelody[noteIndex]
      const oscillator = audioContext.createOscillator()
      const noteGain = audioContext.createGain()

      // Connect: oscillator -> noteGain -> main gainNode -> destination
      oscillator.connect(noteGain)
      noteGain.connect(gainNode)

      // Calculate frequency with pitch adjustment (frequency knob acts as multiplier)
      const pitchMultiplier = frequency / 440 // 440 is the base reference
      oscillator.frequency.value = note.freq * pitchMultiplier
      oscillator.type = 'sine'

      // Smooth envelope for each note
      const now = audioContext.currentTime
      noteGain.gain.setValueAtTime(0, now)
      noteGain.gain.linearRampToValueAtTime(1, now + 0.01)
      noteGain.gain.linearRampToValueAtTime(1, now + note.duration - 0.05)
      noteGain.gain.linearRampToValueAtTime(0, now + note.duration)

      oscillator.start(now)
      oscillator.stop(now + note.duration)

      // Store oscillator reference for frequency updates
      activeOscillatorsRef.current.push({
        oscillator,
        baseFreq: note.freq
      })

      // Clean up when note ends
      oscillator.onended = () => {
        activeOscillatorsRef.current = activeOscillatorsRef.current.filter(
          item => item.oscillator !== oscillator
        )
      }

      // Schedule next note
      const nextIndex = (noteIndex + 1) % christmasMelody.length
      melodyIndexRef.current = nextIndex

      const nextTimeout = setTimeout(() => {
        playNote(nextIndex)
      }, note.duration * 1000)

      timeoutRefs.current.push(nextTimeout)
    }

    // Start the first note
    playNote(0)
  }

  const stopSound = () => {
    if (!isPlaying) return

    shouldLoopRef.current = false

    // Clear any pending timeouts
    timeoutRefs.current.forEach(timeout => {
      clearTimeout(timeout)
    })
    timeoutRefs.current = []

    // Clear active oscillators
    activeOscillatorsRef.current = []

    const audioContext = audioContextRef.current
    if (audioContext) {
      audioContext.close()
    }
    oscillatorRef.current = null
    audioContextRef.current = null
    gainNodeRef.current = null
    setIsPlaying(false)
  }

  // Update volume when knob value changes
  useEffect(() => {
    const gainNode = gainNodeRef.current
    const audioContext = audioContextRef.current
    if (gainNode && audioContext && isPlaying) {
      // Smoothly transition to new volume (0-100 to 0-1)
      gainNode.gain.setTargetAtTime(knobValue / 100, audioContext.currentTime, 0.01)
    }
  }, [knobValue, isPlaying])

  // Update frequency of active oscillators when frequency knob changes
  useEffect(() => {
    const audioContext = audioContextRef.current
    if (audioContext && isPlaying && activeOscillatorsRef.current.length > 0) {
      const pitchMultiplier = frequency / 440 // 440 is the base reference
      const now = audioContext.currentTime

      // Update all active oscillators with the new frequency
      activeOscillatorsRef.current.forEach(({ oscillator, baseFreq }) => {
        const newFreq = baseFreq * pitchMultiplier
        // Use exponentialRampToValueAtTime for smooth pitch changes
        oscillator.frequency.setTargetAtTime(newFreq, now, 0.015)
      })
    }
  }, [frequency, isPlaying])


  return (
    <>
      <h1>MyXmasSynth</h1>
      <div className="card">
        <button type="button" onClick={playSound} disabled={isPlaying}>
          Play Sound
        </button>
        <button type="button" onClick={stopSound} disabled={!isPlaying} style={{ marginLeft: '1em' }}>
          Stop Sound
        </button>
      </div>
      <div className="knob-section">
        <Knob
          value={knobValue}
          onChange={setKnobValue}
          min={0}
          max={100}
          label="Volume"
        />
        <Knob
          value={frequency}
          onChange={setFrequency}
          min={100}
          max={1000}
          label="Frequency"
        />
      </div>
      <div style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
        <p style={{ color: '#ffd700', textShadow: '0 0 10px rgba(255, 215, 0, 0.5)' }}>
          🔔 Volume: <strong>{knobValue}</strong>
        </p>
        <p style={{ color: '#ffd700', textShadow: '0 0 10px rgba(255, 215, 0, 0.5)' }}>
          🎵 Frequency: <strong>{frequency} Hz</strong>
        </p>
        <p style={{ fontSize: '2rem', marginTop: '1.5rem' }}>
          🌟 ⛄ 🌟 ☃️ 🌟 ☃️ 🌟
        </p>
      </div>
    </>
  )
}

export default App

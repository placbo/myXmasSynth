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
    { freq: 392.00, duration: 0.25 }, // G4
    { freq: 261.63, duration: 0.25 }, // C4
    { freq: 293.66, duration: 0.25 }, // D4
    { freq: 329.63, duration: 1.0 },  // E4
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

    // Play the melody
    let currentTime = audioContext.currentTime
    christmasMelody.forEach((note) => {
      const oscillator = audioContext.createOscillator()
      oscillator.connect(gainNode)
      oscillator.frequency.value = note.freq
      oscillator.type = 'sine'

      oscillator.start(currentTime)
      oscillator.stop(currentTime + note.duration)

      currentTime += note.duration
    })

    // Auto-stop after melody finishes
    const totalDuration = christmasMelody.reduce((sum, note) => sum + note.duration, 0)
    const stopTimeout = setTimeout(() => {
      stopSound()
    }, totalDuration * 1000)

    timeoutRefs.current.push(stopTimeout)
  }

  const stopSound = () => {
    if (!isPlaying) return

    // Clear any pending timeouts
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout))
    timeoutRefs.current = []

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


  return (
    <>
      <h1>MySynth</h1>
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
          🎅 ⛄ 🎁 ☃️ 🌟
        </p>
      </div>
    </>
  )
}

export default App

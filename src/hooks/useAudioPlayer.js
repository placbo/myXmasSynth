import { useState, useRef, useEffect } from 'react'
import { christmasMelody, BASE_FREQUENCY } from '../constants/melodies'

/**
 * Custom hook for managing audio playback with melody and frequency control
 * @param {number} volume - Volume level (0-100)
 * @param {number} frequency - Frequency for pitch adjustment
 * @param {number} tempo - Tempo in BPM (beats per minute)
 * @returns {object} Audio player state and controls
 */
export function useAudioPlayer(volume, frequency, tempo) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioContextRef = useRef(null)
  const gainNodeRef = useRef(null)
  const timeoutRefs = useRef([])
  const shouldLoopRef = useRef(false)
  const activeOscillatorsRef = useRef([])
  const melodyIndexRef = useRef(0)
  const frequencyRef = useRef(frequency)
  const tempoRef = useRef(tempo)
  const isInitialTempoRef = useRef(true)

  // Keep refs in sync with props
  frequencyRef.current = frequency
  tempoRef.current = tempo

  /**
   * Play a single note with envelope and pitch adjustment
   */
  const playNote = (noteIndex, audioContext, gainNode) => {
    if (!shouldLoopRef.current || !audioContext) return

    const note = christmasMelody[noteIndex]
    const oscillator = audioContext.createOscillator()
    const noteGain = audioContext.createGain()

    // Connect: oscillator -> noteGain -> main gainNode -> destination
    oscillator.connect(noteGain)
    noteGain.connect(gainNode)

    // Calculate frequency with pitch adjustment
    const pitchMultiplier = frequencyRef.current / BASE_FREQUENCY
    oscillator.frequency.value = note.freq * pitchMultiplier
    oscillator.type = 'sine'

    // Calculate duration based on tempo (120 BPM as reference tempo)
    const tempoMultiplier = 120 / tempoRef.current
    const adjustedDuration = note.duration * tempoMultiplier
    console.log('Playing note with tempo:', tempoRef.current, 'duration:', adjustedDuration)

    // Smooth envelope for each note
    const now = audioContext.currentTime
    noteGain.gain.setValueAtTime(0, now)
    noteGain.gain.linearRampToValueAtTime(1, now + 0.01)
    noteGain.gain.linearRampToValueAtTime(1, now + adjustedDuration - 0.05)
    noteGain.gain.linearRampToValueAtTime(0, now + adjustedDuration)

    oscillator.start(now)
    oscillator.stop(now + adjustedDuration)

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
      playNote(nextIndex, audioContext, gainNode)
    }, adjustedDuration * 1000)

    timeoutRefs.current.push(nextTimeout)
  }

  /**
   * Start audio playback
   */
  const play = () => {
    if (isPlaying) return // Prevent multiple play

    const audioContext = new globalThis.AudioContext()
    const gainNode = audioContext.createGain()

    gainNode.connect(audioContext.destination)
    gainNode.gain.setValueAtTime(volume / 100, audioContext.currentTime)

    audioContextRef.current = audioContext
    gainNodeRef.current = gainNode
    setIsPlaying(true)
    shouldLoopRef.current = true
    melodyIndexRef.current = 0

    // Start the first note
    playNote(0, audioContext, gainNode)
  }

  /**
   * Stop audio playback and cleanup
   */
  const stop = () => {
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
    audioContextRef.current = null
    gainNodeRef.current = null
    setIsPlaying(false)
  }

  // Update volume when volume changes
  useEffect(() => {
    const gainNode = gainNodeRef.current
    const audioContext = audioContextRef.current
    if (gainNode && audioContext && isPlaying) {
      // Smoothly transition to new volume (0-100 to 0-1)
      gainNode.gain.setTargetAtTime(volume / 100, audioContext.currentTime, 0.01)
    }
  }, [volume, isPlaying])

  // Update frequency of active oscillators when frequency changes
  useEffect(() => {
    const audioContext = audioContextRef.current
    if (audioContext && isPlaying && activeOscillatorsRef.current.length > 0) {
      const pitchMultiplier = frequency / BASE_FREQUENCY
      const now = audioContext.currentTime

      // Update all active oscillators with the new frequency
      activeOscillatorsRef.current.forEach(({ oscillator, baseFreq }) => {
        const newFreq = baseFreq * pitchMultiplier
        // Use setTargetAtTime for smooth pitch changes
        oscillator.frequency.setTargetAtTime(newFreq, now, 0.015)
      })
    }
  }, [frequency, isPlaying])

  // Handle tempo changes during playback
  useEffect(() => {
    // Skip the initial render
    if (isInitialTempoRef.current) {
      isInitialTempoRef.current = false
      return
    }

    // Only run if currently playing
    if (!isPlaying) return

    const audioContext = audioContextRef.current
    const gainNode = gainNodeRef.current

    console.log('Tempo effect triggered:', tempo, 'isPlaying:', isPlaying)

    if (audioContext && gainNode) {
      console.log('Restarting with new tempo:', tempo)
      // Clear pending timeouts to stop scheduled notes
      timeoutRefs.current.forEach(timeout => {
        clearTimeout(timeout)
      })
      timeoutRefs.current = []

      // Continue from current melody position with new tempo
      const currentIndex = melodyIndexRef.current
      playNote(currentIndex, audioContext, gainNode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempo])

  return {
    isPlaying,
    play,
    stop
  }
}


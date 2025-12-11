import { useState } from 'react'

import './App.scss'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import AudioControls from './components/AudioControls'
import KnobSection from './components/KnobSection'
import StatusDisplay from './components/StatusDisplay'

function App() {
  const [volume, setVolume] = useState(50)
  const [frequency, setFrequency] = useState(440) // A4 note

  const { isPlaying, play, stop } = useAudioPlayer(volume, frequency)


  return (
    <>
      <h1>MyXmasSynth</h1>
      <AudioControls
        isPlaying={isPlaying}
        onPlay={play}
        onStop={stop}
      />
      <KnobSection
        volume={volume}
        onVolumeChange={setVolume}
        frequency={frequency}
        onFrequencyChange={setFrequency}
      />
      <StatusDisplay
        volume={volume}
        frequency={frequency}
      />
    </>
  )
}

export default App

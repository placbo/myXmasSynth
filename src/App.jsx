import { useState } from 'react'

import './App.scss'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import AudioControls from './components/AudioControls'
import KnobSection from './components/KnobSection'
import StatusDisplay from './components/StatusDisplay'
import SnowEffect from "./components/SnowEffect.jsx";

function App() {
  const [volume, setVolume] = useState(50)
  const [frequency, setFrequency] = useState(440) // A4 note
  const [tempo, setTempo] = useState(120) // 120 BPM default

  const { isPlaying, play, stop } = useAudioPlayer(volume, frequency, tempo)


  return (
    <>
      <SnowEffect />
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
        tempo={tempo}
        onTempoChange={setTempo}
      />
      <StatusDisplay
        volume={volume}
        frequency={frequency}
        tempo={tempo}
      />
    </>
  )
}

export default App

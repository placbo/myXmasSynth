import { useState } from 'react'

import './App.scss'
import AudioControls from './components/AudioControls'
import KnobSection from './components/KnobSection'
import SnowEffect from './components/SnowEffect.jsx'
import StatusDisplay from './components/StatusDisplay'
import { useAudioPlayer } from './hooks/useAudioPlayer'

function App() {
  const [volume, setVolume] = useState(50)
  const [frequency, setFrequency] = useState(440) // A4 note
  const [tempo, setTempo] = useState(120) // 120 BPM default
  const [reverb, setReverb] = useState(0) // 0-100 reverb amount

  const { isPlaying, play, stop } = useAudioPlayer(
    volume,
    frequency,
    tempo,
    reverb,
  )

  return (
    <>
      <SnowEffect />
      <h1>MyXmasSynth</h1>
      <AudioControls isPlaying={isPlaying} onPlay={play} onStop={stop} />
      <KnobSection
        volume={volume}
        onVolumeChange={setVolume}
        frequency={frequency}
        onFrequencyChange={setFrequency}
        tempo={tempo}
        onTempoChange={setTempo}
        reverb={reverb}
        onReverbChange={setReverb}
      />
      <StatusDisplay
        volume={volume}
        frequency={frequency}
        tempo={tempo}
        reverb={reverb}
      />
    </>
  )
}

export default App

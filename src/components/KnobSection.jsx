import Knob from '../Knob'
import './KnobSection.scss'

/**
 * Section containing volume and frequency control knobs
 * @param {number} volume - Current volume value
 * @param {function} onVolumeChange - Callback for volume changes
 * @param {number} frequency - Current frequency value
 * @param {function} onFrequencyChange - Callback for frequency changes
 * @param {number} tempo - Current tempo value (BPM)
 * @param {function} onTempoChange - Callback for tempo changes
 * @param {number} reverb - Current reverb value (0-100)
 * @param {function} onReverbChange - Callback for reverb changes
 */
export default function KnobSection({
  volume,
  onVolumeChange,
  frequency,
  onFrequencyChange,
  tempo,
  onTempoChange,
  reverb,
  onReverbChange,
}) {
  return (
    <div className="knob-section">
      <Knob
        value={volume}
        onChange={onVolumeChange}
        min={0}
        max={100}
        label="Volume"
      />
      <Knob
        value={frequency}
        onChange={onFrequencyChange}
        min={100}
        max={1000}
        label="Frequency"
      />
      <Knob
        value={tempo}
        onChange={onTempoChange}
        min={60}
        max={180}
        label="Tempo (BPM)"
      />
      <Knob
        value={reverb}
        onChange={onReverbChange}
        min={0}
        max={100}
        label="Reverb"
      />
    </div>
  )
}

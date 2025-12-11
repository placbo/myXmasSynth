import './StatusDisplay.scss'

/**
 * Display component showing current volume and frequency values
 * @param {number} volume - Current volume value
 * @param {number} frequency - Current frequency value
 * @param {number} tempo - Current tempo value (BPM)
 */
export default function StatusDisplay({ volume, frequency, tempo }) {
  return (
    <div className="status-display">
      <p className="status-text">
        🔔 Volume: <strong>{volume}</strong>
      </p>
      <p className="status-text">
        🎵 Frequency: <strong>{frequency} Hz</strong>
      </p>
      <p className="status-text">
        🎹 Tempo: <strong>{tempo} BPM</strong>
      </p>
      <p className="decoration">
        🌟 ⛄ 🌟 ☃️ 🌟 ☃️ 🌟
      </p>
    </div>
  )
}


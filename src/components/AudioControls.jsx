import './AudioControls.scss'

/**
 * Audio control buttons for play/stop functionality
 * @param {boolean} isPlaying - Whether audio is currently playing
 * @param {function} onPlay - Callback for play action
 * @param {function} onStop - Callback for stop action
 */
export default function AudioControls({ isPlaying, onPlay, onStop }) {
  return (
    <div className="card">
      <button type="button" onClick={onPlay} disabled={isPlaying} aria-label="Play Sound">
        ▶
      </button>
      <button type="button" onClick={onStop} disabled={!isPlaying} style={{ marginLeft: '1em' }} aria-label="Stop Sound">
        ■
      </button>
    </div>
  )
}


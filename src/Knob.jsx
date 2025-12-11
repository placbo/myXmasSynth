import { useCallback, useEffect, useRef, useState } from 'react'
import './Knob.scss'

function Knob({ value, onChange, min = 0, max = 100, label = 'Knob' }) {
  const [isDragging, setIsDragging] = useState(false)
  const knobRef = useRef(null)

  const handleMouseMove = useCallback(
    e => {
      const knob = knobRef.current
      if (!knob) return

      const rect = knob.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaY = e.clientY - centerY
      const deltaX = e.clientX - centerX

      // Calculate angle in degrees (0-360)
      let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
      angle += 90 // Adjust so 0 degrees is at top

      if (angle < 0) angle += 360

      // Map angle to value range (use 300 degrees of rotation, leaving 60 degrees gap at bottom)
      const minAngle = 30 // Start at 30 degrees
      const maxAngle = 330 // End at 330 degrees

      let mappedAngle = angle
      if (mappedAngle < minAngle) {
        mappedAngle = minAngle
      } else if (mappedAngle > maxAngle && mappedAngle < 360) {
        mappedAngle = maxAngle
      }

      const angleRange = maxAngle - minAngle
      const normalizedAngle = (mappedAngle - minAngle) / angleRange

      const newValue = Math.round(min + normalizedAngle * (max - min))
      const clampedValue = Math.max(min, Math.min(max, newValue))

      onChange(clampedValue)
    },
    [min, max, onChange],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseDown = e => {
    setIsDragging(true)
    e.preventDefault()
  }

  // Add global mouse event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Calculate rotation angle from value
  const minAngle = 30
  const maxAngle = 330
  const angleRange = maxAngle - minAngle
  const normalizedValue = (value - min) / (max - min)
  const rotation = minAngle + normalizedValue * angleRange

  return (
    <div className="knob-container">
      <div className="knob-label">{label}</div>
      <div
        ref={knobRef}
        className={`knob ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleMouseDown}
        style={{ transform: `rotate(${rotation}deg)` }}
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={0}
      >
        <div className="knob-indicator"></div>
      </div>
      <div className="knob-value">{value}</div>
    </div>
  )
}

export default Knob

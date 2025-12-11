import { useEffect, useRef } from 'react'
import './SnowEffect.scss'

const SnowEffect = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let snowflakes = []

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Snowflake factory function
    const createSnowflake = (startY = Math.random() * canvas.height) => {
      const snowflake = {
        x: Math.random() * canvas.width,
        y: startY,
        radius: Math.random() * 3 + 1,
        speed: Math.random() + 0.5,
        wind: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.6 + 0.4,

        reset() {
          snowflake.x = Math.random() * canvas.width
          snowflake.y = -10
          snowflake.radius = Math.random() * 3 + 1
          snowflake.speed = Math.random() + 0.5
          snowflake.wind = Math.random() * 0.5 - 0.25
          snowflake.opacity = Math.random() * 0.6 + 0.4
        },

        update() {
          snowflake.y += snowflake.speed
          snowflake.x += snowflake.wind

          // Reset snowflake when it goes off screen
          if (snowflake.y > canvas.height) {
            snowflake.reset()
          }

          if (snowflake.x > canvas.width || snowflake.x < 0) {
            snowflake.x = Math.random() * canvas.width
          }
        },

        draw() {
          ctx.beginPath()
          ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${snowflake.opacity})`
          ctx.fill()
          ctx.closePath()
        },
      }

      return snowflake
    }

    // Create snowflakes
    const initSnowflakes = () => {
      const count = Math.floor((canvas.width * canvas.height) / 10000)
      snowflakes = []
      for (let i = 0; i < count; i++) {
        snowflakes.push(createSnowflake())
      }
    }
    initSnowflakes()

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      snowflakes.forEach(snowflake => {
        snowflake.update()
        snowflake.draw()
      })

      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="snow-canvas" />
}

export default SnowEffect

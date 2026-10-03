import { useState, useEffect } from 'react'

export default function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1200 }) {
  const [displayValue, setDisplayValue] = useState(0)

  // Extract number from value if string
  const targetNumber = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0

  useEffect(() => {
    let startTimestamp = null
    let frameId = null

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(easeProgress * targetNumber)
      setDisplayValue(current)

      if (progress < 1) {
        frameId = requestAnimationFrame(step)
      } else {
        setDisplayValue(targetNumber)
      }
    }

    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [targetNumber, duration])

  return (
    <span className="tabular-nums font-bold">
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}

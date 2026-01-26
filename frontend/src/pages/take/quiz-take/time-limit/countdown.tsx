import { useEffect, useState } from 'react'

interface CountdownProps {
    readonly timeLimit: number
    readonly onTimeLimit: () => void
}

export const Countdown = ({ onTimeLimit, timeLimit }: CountdownProps) => {
    const durationMs = (timeLimit || 120) * 1000

    const [timeLeft, setTimeLeft] = useState(durationMs)

    useEffect(() => {
        const endTime = Date.now() + durationMs
        const interval = setInterval(() => {
            const newTimeLeft = endTime - Date.now()
            if (newTimeLeft <= 0) {
                clearInterval(interval)
                setTimeLeft(0)
            } else {
                setTimeLeft(newTimeLeft)
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [durationMs])

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeLimit()
        }
    }, [timeLeft, onTimeLimit])

    const minutes = Math.floor(timeLeft / 60000)
    const seconds = Math.floor((timeLeft % 60000) / 1000)

    return (
        <div data-testid="timerID">{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</div>
    )
}

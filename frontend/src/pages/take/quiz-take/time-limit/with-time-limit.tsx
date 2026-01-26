import { useState } from 'react'
import { Countdown } from './countdown.tsx'
import { TimeOutReachedModal } from './timeout-reached-modal.tsx'

interface TimeLimitProps {
    readonly timeLimit: number
    readonly onConfirm: () => void
}

export const TimeLimit = ({ timeLimit, onConfirm }: TimeLimitProps) => {
    const [timeoutReached, setTimeoutReached] = useState(false)

    return (
        <div>
            <Countdown timeLimit={timeLimit} onTimeLimit={() => setTimeoutReached(true)} />
            {timeoutReached && <TimeOutReachedModal onConfirm={onConfirm} />}
        </div>
    )
}

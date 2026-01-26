import { useEffect, useRef } from 'react'
import { EvaluateButton } from '../components/buttons.tsx'

interface TimeOutReachedModalProps {
    readonly onConfirm: () => void
}

export const TimeOutReachedModal = ({ onConfirm }: TimeOutReachedModalProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null)
    useEffect(() => {
        if (dialogRef.current) {
            dialogRef.current.showModal()
        }
    })

    return (
        <dialog ref={dialogRef}>
            <p>Game over time</p>
            <EvaluateButton onClick={onConfirm} />
        </dialog>
    )
}

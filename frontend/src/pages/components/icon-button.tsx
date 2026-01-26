import { Button } from './button.tsx'

export type IconButtonProps = {
    onClick: () => void
    disabled?: boolean
    className?: string
    children: React.ReactNode
}

const IconButton = ({ onClick, disabled = false, className, children }: IconButtonProps) => {
    return (
        <Button onClick={onClick} className={`${className} secondary button p-2 icon-button`} disabled={disabled}>
            {children}
        </Button>
    )
}

export default IconButton

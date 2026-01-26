import { useSearchParams } from 'react-router-dom'

export const useWorkspaceGuid = () => {
    const [searchParams] = useSearchParams()
    return searchParams.get('workspaceguid') || ''
}

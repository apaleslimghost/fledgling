import { createContext, useContext, useEffect } from "react";

export const Workspace = createContext<string | null>(null)

export const useWorkspace = () => {
	const workspace = useContext(Workspace)
	if (!workspace) {
		throw new Error("Workspace context is not available")
	}
	return workspace
}

export const ActiveTags = createContext<[string[], (tags: string[]) => void] | null>(null)

export const useActiveTags = () => {
	const activeTags = useContext(ActiveTags)
	if (!activeTags) {
		throw new Error("activeTags context is not available")
	}

	return activeTags
}

export const useSetActiveTags = (activeTags: string[]) => {
	const [, setActiveTags] = useActiveTags()

	useEffect(() => {
		setActiveTags(activeTags)
	}, [JSON.stringify(activeTags)])
}

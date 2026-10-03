import { createContext, useContext } from "react";

export const Workspace = createContext<string | null>(null)

export const useWorkspace = () => {
	const workspace = useContext(Workspace)
	if (!workspace) {
		throw new Error("Workspace context is not available")
	}
	return workspace
}

import { isCuid } from "@paralleldrive/cuid2"

export type Context = {
	workspaceId: string
}

declare module "@rocicorp/zero" {
	interface DefaultTypes {
		context: Context | undefined
	}
}

export function getWorkspaceFromRequest(request: Request): Context | undefined {
	const authHeader = request.headers.get('Authorization')

	if (authHeader) {
		const workspaceId = authHeader.split(' ')[1]
		if (workspaceId && isCuid(workspaceId)) {
			return { workspaceId }
		}
	}
}

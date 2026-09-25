import { redirect } from "react-router";
import { cuid } from "~/data/cuid";

export function loader() {
	const workspaceId = cuid()
	return redirect(`/workspace/${workspaceId}`)
}

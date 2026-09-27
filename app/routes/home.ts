import { redirect } from "react-router";
import { cuid } from "~/data/cuid";
// import { zero } from "~/data/zero";
import { mutators } from "~/zero/mutators";

export async function clientLoader() {
	const workspaceId = cuid()
	// await zero.mutate(mutators.workspace.create({ id: workspaceId })).client

	return redirect(`/workspace/${workspaceId}`)
}

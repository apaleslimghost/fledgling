import { redirect } from "react-router";
import type { Route } from "./+types/redirect";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	return redirect(`/workspace/${params.workspaceId}`)
}

export default () => null

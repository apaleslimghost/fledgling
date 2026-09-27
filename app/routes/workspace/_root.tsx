import { ZeroProvider } from "@rocicorp/zero/react";
import { Outlet } from "react-router";
import { Sidebar } from "~/components/sidebar";
import { zeroOptions } from "~/data/zero";
import type { Route } from "./+types/_root";
import { isCuid } from "@paralleldrive/cuid2";

export function clientLoader({ params }: Route.ClientLoaderArgs) {
	if (!isCuid(params.workspaceId)) {
		throw new Error(`Invalid workspace ID ${params.workspaceId}`)
	}
}

export default function ({ params }: Route.ComponentProps) {
	return <ZeroProvider {...zeroOptions} userID={params.workspaceId} auth={params.workspaceId} context={{
		workspaceId: params.workspaceId,
	}}>
		<main className="panels">
			<Sidebar />
			<Outlet />
		</main>
	</ZeroProvider>
}

import { ZeroProvider } from "@rocicorp/zero/react";
import { Outlet } from "react-router";
import { Sidebar } from "~/components/sidebar";
import { schema } from "~/prisma/generated/zero/schema";
import { mutators } from "~/zero/mutators";

export default function () {
	return <ZeroProvider cacheURL='http://localhost:4848' schema={schema} mutators={mutators}>
		<main className="panels">
			<Sidebar />
			<Outlet />
		</main>
	</ZeroProvider>
}

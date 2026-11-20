import { redirect, useNavigate } from "react-router";
import { Icon } from "~/components/icon";
import { cuid } from "~/data/cuid";
import database from "~/data/rxdb";
import type { Session } from "~/data/schema";

export async function clientLoader() {
	const session = await database.getLocal<Session>('session')

	const workspaceId: string = session?.get('workspaceId')

	if (workspaceId) {
		return redirect(`/workspace/${workspaceId}`)
	}
}

export default () => {
	const navigate = useNavigate()

	return <div className='splash'>
		<button className="surface lo large" onClick={async () => {
			const workspaceId = cuid()
			await database.workspaces.insert({ id: workspaceId })
			await database.upsertLocal<Session>('session', { workspaceId })

			navigate(`/workspace/${workspaceId}`)
		}}>
			<Icon icon='DatabaseAdd' />
			create workspace
		</button>
	</div>
}

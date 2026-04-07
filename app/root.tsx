import { Links, Meta, Outlet, redirect, Scripts, ScrollRestoration } from 'react-router'
import { RxDatabaseProvider } from 'rxdb/plugins/react'

import db from './lib/rxdb'

import 'tippy.js/dist/tippy.css'
import '~/css/index.css'
import { Surface } from '@heroui/react'
import type { RxDatabase } from 'rxdb'
import Sidebar from './components/sidebar'

export async function clientAction() {
	const note = await db.notes.insert({
		id: crypto.randomUUID(),
		tags: [],
	})

	return redirect(`/note/${note.id}`)
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<RxDatabaseProvider database={db as unknown as RxDatabase}>
					<div className="flex bg-gray-100 h-dvh p-4 gap-4">
						<Sidebar />

						<div className="grow">{children}</div>
					</div>
				</RxDatabaseProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	return <Outlet />
}

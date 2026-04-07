import { Box, Flex, ScrollArea, Theme } from '@radix-ui/themes'
import { Links, Meta, Outlet, redirect, Scripts, ScrollRestoration } from 'react-router'
import { RxDatabaseProvider } from 'rxdb/plugins/react'

import db from './lib/rxdb.client'

import '@radix-ui/themes/styles.css'
import 'tippy.js/dist/tippy.css'
import '~/css/index.css'
import type { RxDatabase } from 'rxdb'
import Sidebar from './components/sidebar'

const MaybeRxProvider = ({
	rxdb,
	children,
}: {
	rxdb?: RxDatabase<any>
	children: React.ReactNode
}) => {
	return rxdb ? <RxDatabaseProvider database={rxdb}>{children}</RxDatabaseProvider> : children
}

export async function clientAction() {
	const note = await db.notes.insert({
		id: crypto.randomUUID(),
		tags: [],
	})

	return redirect(`/note/${note.id}`)
}

export function Layout({ children }: { children: React.ReactNode }) {
	console.log(db)
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<Theme
					accentColor="iris"
					grayColor="mauve"
					radius="large"
					scaling="105%"
					appearance="light"
				>
					<MaybeRxProvider rxdb={db}>
						<Flex align="stretch" height="100dvh">
							{db && <Sidebar />}

							<Box pl="3" flexGrow="1" style={{ height: '100%' }}>
								<ScrollArea scrollbars="vertical" type="hover">
									{children}
								</ScrollArea>
							</Box>
						</Flex>
					</MaybeRxProvider>
				</Theme>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	return <Outlet />
}

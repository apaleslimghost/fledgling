import { FilePlusIcon } from '@radix-ui/react-icons'
import { Box, Button, Flex, ScrollArea, Theme } from '@radix-ui/themes'
import {
	Form,
	Links,
	Meta,
	Outlet,
	redirect,
	Scripts,
	ScrollRestoration,
	useRouteLoaderData,
} from 'react-router'
import { RxDatabaseProvider } from 'rxdb/plugins/react'

import TagTree from '~/components/tag-tree'
import rxdb from './lib/rxdb.client'

import '@radix-ui/themes/styles.css'
import 'tippy.js/dist/tippy.css'
import '~/css/index.css'
import type { RxDatabase } from 'rxdb'

const MaybeRxProvider = ({ rxdb, children }: { rxdb?: RxDatabase; children: React.ReactNode }) => {
	return rxdb ? <RxDatabaseProvider database={rxdb}>{children}</RxDatabaseProvider> : children
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
				<Theme
					accentColor="iris"
					grayColor="mauve"
					radius="large"
					scaling="105%"
					appearance="light"
				>
					<MaybeRxProvider rxdb={rxdb}>
						<Flex align="stretch" height="100dvh">
							<Theme appearance="dark" style={{ height: '100%' }}>
								<Box flexBasis="16em" p="3" style={{ height: '100%' }}>
									<ScrollArea scrollbars="vertical" type="hover">
										<Form method="post">
											<Button>
												<FilePlusIcon />
												Create
											</Button>
										</Form>
									</ScrollArea>
								</Box>
							</Theme>

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

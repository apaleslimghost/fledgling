import { handleQueryRequest } from '@rocicorp/zero/server'
import { mustGetQuery } from '@rocicorp/zero'
import { queries } from '../../zero/queries'
import { schema } from '../../prisma/generated/zero/schema'
import type { Route } from './+types/query'
import { data } from 'react-router'
import { getWorkspaceFromRequest } from '~/data/auth'

export async function action({ request }: Route.ActionArgs) {
	const ctx = getWorkspaceFromRequest(request)

	const result = await handleQueryRequest({
		handler: (name, args) => mustGetQuery(queries, name).fn({ args, ctx }),
		schema,
		request,
		userID: ctx?.workspaceId
	})

	return data(result)
}

import { handleQueryRequest } from '@rocicorp/zero/server'
import { mustGetQuery } from '@rocicorp/zero'
import { queries } from '../../zero/queries'
import { schema } from '../../prisma/generated/zero/schema'
import type { Route } from './+types/query'
import { data } from 'react-router'

export async function action({ request }: Route.ActionArgs) {
	const result = await handleQueryRequest({
		handler: (name, args) => mustGetQuery(queries, name).fn({ args }),
		schema,
		request,
		userID: null
	})

	return data(result)
}

import { handleMutateRequest, handleQueryRequest } from '@rocicorp/zero/server'
import { mustGetMutator, mustGetQuery } from '@rocicorp/zero'
import { mutators } from '../../zero/mutators'
import { schema } from '../../prisma/generated/zero/schema'
import { dbProvider } from '../../zero/db-provider'
import type { Route } from './+types/mutate'
import { data } from 'react-router'

export async function action({ request }: Route.ActionArgs) {
	const result = await handleMutateRequest({
		dbProvider,
		handler: transact =>
			transact((tx, name, args) =>
				mustGetMutator(mutators, name).fn({ args, tx })
			),
		request,
		userID: null
	})

	return data(result)
}

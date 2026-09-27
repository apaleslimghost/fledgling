import { handleMutateRequest, handleQueryRequest } from '@rocicorp/zero/server'
import { mustGetMutator } from '@rocicorp/zero'
import { mutators } from '../../zero/mutators'
import { dbProvider } from '../../zero/db-provider'
import type { Route } from './+types/mutate'
import { data } from 'react-router'
import { getWorkspaceFromRequest } from '~/data/auth'

export async function action({ request }: Route.ActionArgs) {
	const ctx = getWorkspaceFromRequest(request)

	const result = await handleMutateRequest({
		dbProvider,
		handler: transact =>
			transact((tx, name, args) =>
				mustGetMutator(mutators, name).fn({ args, tx, ctx })
			),
		request,
		userID: ctx?.workspaceId
	})

	return data(result)
}

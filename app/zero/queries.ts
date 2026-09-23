import { defineQueries, defineQuery } from '@rocicorp/zero'
import { z } from 'zod'
import { zql } from '../prisma/generated/zero/schema'

export const queries = defineQueries({
	tag: {
		byId: defineQuery(
			z.object({
				id: z.string(),
			}),
			({ args: { id } }) => zql.Tag.where('id', id).one().related('notes')
		),

		all: defineQuery(
			() => zql.Tag
		),
	},

	project: {
		byId: defineQuery(
			z.object({
				id: z.string(),
			}),
			({ args: { id } }) => zql.Project.where('id', id).one()
		),

		all: defineQuery(
			() => zql.Project
		),
	},

	note: {
		byId: defineQuery(
			z.object({
				id: z.string(),
			}),
			({ args: { id } }) => zql.Note.where('id', id).one().related('projects').related('tags')
		),

		all: defineQuery(
			() => zql.Note
		),
	}
})
